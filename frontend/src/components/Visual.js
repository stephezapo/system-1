import React from "react";
import Client from "../Client";
import '../index.css';
import {ScrollPanel} from 'primereact/scrollpanel';
import {AppContext} from '../AppContext'
import {Card} from 'primereact/card';
import SliderRow from "./SliderRow";
import LiveImage from "./LiveImage";
import {Button} from 'primereact/button';


class Visual extends React.Component 
{
  	state = {
        status: [],
        parameters: [],
      };


    constructor()
    {
        super();
        
        this.updateInfo = this.updateInfo.bind(this);
    }

  	componentDidMount()
  	{
	  	Client.getVisualParameters("", params => {

            //sort by name
            params.sort(function(a, b){
                if(a.id < b.id) { return -1; }
                if(a.id > b.id) { return 1; }
                return 0;
            })

            this.setState({parameters: params});
          });
        
        // TO DO: activating this interval causes parameter controls to update (re-render) continuously, preventing the user from using them
        //this.interval = setInterval(() => this.updateInfo(), 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.interval);

        this._isMounted = false;
    }

    updateInfo()
	{
        Client.getCameraStatus(data => {
            this.setState({status: data});
        })
	}

    handleClick()
    {
        Client.grabFrame();
    }

    render()
    {
        if(this.state.status.status==0)
        {
            return (
                <div className="Content">
                    <br/>
                    <br/>
                    <Card title="Offline">
                        <br/>
                        Camera module is offline!
                    </Card>
                </div>
                );
        }

        let Sliders = ({data}) => (
            <table style={{'borderCollapse':'separate', 'borderSpacing':10}}>
                <tbody>
                    {data.map(param => (
                        <SliderRow key={param.id} paramID={param.id} paramValue={param.value} paramMin={param.min} paramMax={param.max}/>   
                    ))}
                </tbody>
            </table>
            ); 

        return (
            <div className="Content">
                <br/>
                <LiveImage/>
                <br/> 
                <Button label="Capture Frame" onClick={this.handleClick} icon="pi pi-camera" style={{'width':'100%'}} />
                <br/>
                
                <ScrollPanel style={{width: '100%', height: '100%'}}>      
                    <Sliders data={this.state.parameters} />
                </ScrollPanel>
            </div>
            );
    }
}

Visual.contextType = AppContext;
export default Visual;