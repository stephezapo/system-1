import React, { Component } from 'react';
import Client from "./Client";
import logo from './media/zaceye_logo.png';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import Visual from './components/Visual';
import VisualCalibration from './components/VisualCalibration';
import ResourceMonitor from './components/ResourceMonitor';
import {Route, HashRouter} from "react-router-dom";
import 'primereact/resources/themes/luna-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Menubar} from 'primereact/menubar';
import {AppContext} from './AppContext'
import ServerConnection from './components/ServerConnection'

/**
 * This is the parent component. It manages site navigation as well as holds the current show object. 
 */
class App extends Component 
{
    _isMounted = false;

	static defaultProps = {
		searchText: "",
	}

	constructor(props)
	{
		super(props);
		this.state = {
            online: false,
            currentShowId: -2,
            currentShowEntry: {},
			title: "Visual",
			currentRoute: "/",
			items:[
				{
					label:'Visual',
					icon:'pi pi-fw pi-info',
					command: (event) => {
						this.setState({searchText: "", title: "Visual", currentRoute: "/"});
						window.location.hash = "/";
					}
                },
                {
					label:'Calibration',
					icon:'pi pi-fw pi-info',
					command: (event) => {
						this.setState({searchText: "", title: "Camera Calibration", currentRoute: "/visualcalibration"});
						window.location.hash = "/visualcalibration";
					}
                }/*,
				{
					label:'Resource Monitor',
					icon:'pi pi-fw pi-chart-bar',
					command: (event) => {
						this.setState({searchText: "", title: "Resource Monitor", currentRoute: "/resourcemonitor"});
						window.location.hash = "/resourcemonitor";
					}
                }*/
			 ]
		  };

        this.changeOnlineStatus = this.changeOnlineStatus.bind(this);
	}

    componentDidMount()
    {
        this._isMounted = true;

        //this.interval = setInterval(() => this.updateData(), 3000);
    }

    updateData()
    {
        Client.getActiveShowId("", data => {
            
            if(this.state.currentShowId != data && data>=0 && this._isMounted)
            {
                this.setState({currentShowId: data});
                this.updateShowData();
            }     
        });
    }

    updateShowData()
    {
        Client.getActiveHistoryEntry("", entry => {
            if(this._isMounted)
            {
                this.setState({ currentShowEntry: entry});
            }
        });
    }

    componentWillUnmount()
    {
        this._isMounted = false;

	    //clearInterval(this.interval);
    }

    /*
    * This gets called whenever the online status in the ServerConnection component changes.
    */
	changeOnlineStatus(value)
	{
        this.setState({online: value});
	}
	
	render() 
	{
		return (
			<div id="main">
				<header className="App-header">
                {this.state.title}
				<img src={logo} className="App-logo" alt="logo" />
				</header>

				<HashRouter>
					<div className="Line"/>
					<div className="MenuBar content-section implementation">
						<Menubar model={this.state.items}>
						<div style={{position:'absolute',left:'50%'}}>		
								<ServerConnection changeOnlineStatus = {this.changeOnlineStatus}/>		
							</div>
						</Menubar>
					</div>
					<div className="Line"/>

					<AppContext.Provider value={{online: this.state.online, currentShowEntry: this.state.currentShowEntry}}>
						<div id="content" className="content" >
							<Route exact path="/" component={Visual}/>
                            <Route path="/visualcalibration" component={VisualCalibration}/>
                            <Route path="/resourcemonitor" component={ResourceMonitor}/>
							<Route exact path="/temp" component={LoadingScreen}/>
						</div>
					</AppContext.Provider>		
				</HashRouter>
			</div>
			);
	}
}

export default App;