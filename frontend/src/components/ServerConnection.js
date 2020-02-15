import React from "react";
import Client from "../Client";
import '../index.css';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Growl} from 'primereact/growl';


class ServerConnection extends React.Component 
{
    _isMounted = false;

	state = {
		loaded: false,
		online: false,
		lastOnline: false,
		dialog: false,
		hostIP: "127.0.0.1"
	};

	constructor(props)
	{
		super(props);
		this.onClick = this.onClick.bind(this);
		this.onHide = this.onHide.bind(this);
		this.updateState = this.updateState.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
	}

	componentDidMount()
	{
        this._isMounted = true;

		//this.interval = setInterval(() => this.updateState(), 1000);
	}

	componentWillUnmount()
	{
        this._isMounted = false;

		clearInterval(this.interval);
	}

	updateState()
	{
		Client.isOnline("", data => {
			this.setState({online: data.online, loaded: true});

			//forward online state changes to parent
			if(this.state.online != this.state.lastOnline)
			{
				this.props.changeOnlineStatus(this.state.online);
			}

            if(this._isMounted)
            {
                this.setState({lastOnline: this.state.online});
            }
		})
	}

	onClick()
	{
		this.setState({hostIP: ""});

		Client.getConnectedServerIP("", data => {
            this.setState({hostIP: data});
            
            if(this.state.hostIP!="")
            {
                this.setState({dialog: true});
            }
		});
	}

	onConfirm()
	{
		const newIP = this.state.hostIP;

		//Check if IP is valid
		try
		{
			var numbers = newIP.split('.');
			if(numbers.length!=4)
			{
				throw -1;
			}

			for (var i = 0; i < numbers.length; i++)
			{
				var num = parseInt(numbers[i]);
				if(num<0 || num>255)
				{
					throw -1;
				}
			}

			Client.setConnectedServerIP(newIP);

			this.setState({dialog: false});
		}
		catch(e)
		{
			this.growl.show({severity: 'error', summary: 'Invalid IP', detail: 'IP must be of format X.X.X.X\nwith values [0..255]'});
			console.error("Invalid IP string " + newIP);
		}

		if(numbers.length!=4)
		{

		}
	}

	onHide()
	{
		this.setState({dialog: false});
	}	

	render()
	{
		if(!this.state.loaded)
		{
			//return null;
			return (
				<div/>
			);
		}
		else
		{
			var text = this.state.online ? "Online" : "Offline";
			var style = this.state.online ? "p-button-raised p-button-success" : "p-button-raised p-button-danger"

			var ip = this.state.hostIP;
			if(ip=="localhost")
			{
				ip = "127.0.0.1";
			}

			return (
				<div>
					<Button label={text} className={style} onClick={this.onClick} style={{position:'absolute'}}/>

                    <Dialog header="Server IP" visible={this.state.dialog}  onHide={this.onHide}>
                        <Growl ref={(el) => this.growl = el} />
                        <InputText keyfilter="num" placeholder="Numbers" value={ip} onChange={(e) => this.setState({hostIP: e.target.value})}/>
                        <Button label="Set" className="p-button-raised p-button-success" onClick={this.onConfirm} style={{marginLeft: '20px'}}/>
                        <Button label="Cancel" className="p-button-raised p-button-warning" onClick={this.onHide} style={{marginLeft: '10px'}}/>
                    </Dialog>
				</div>
				);
		}
	}
}

export default ServerConnection;