import React from "react";
import Client from "../Client";
import '../index.css';
import {ScrollPanel} from 'primereact/scrollpanel';
import {AppContext} from '../AppContext'
import {Chart} from 'primereact/chart';
import {Card} from 'primereact/card';


class ResourceMonitor extends React.Component 
{
    _isMounted = false;
    gettingData = false;
    timeAxis = [];

  	state = {
        universeData: [],
        selectedUniverse: {name: " "},
        cpuValues: [],
        ramValues: [],
        maxValues: [],
        currentCPU: 0,
        currentRAM: 0
  	};

  	componentDidMount()
  	{
        this._isMounted = true;

        this.inputOutputTemplate = this.inputOutputTemplate.bind(this);

        for(var i = -99; i<=0; i++) {
            this.timeAxis.push(i)
        }

        this.interval = setInterval(() => this.updateResourceData(), 2000);
	}

	componentWillUnmount()
	{
        this._isMounted = false;

		clearInterval(this.interval);
	}
    
    updateResourceData()
    {
        if(this.gettingData) //prevent new update when the previous update has not finished yet
        {
            return;
        }

        this.gettingData = true;

		Client.getCpuUsage("", data => {
            if(this._isMounted)
            {
                var newData = [];

                while(newData.length+data.length<100)
                {
                    newData.push(0)
                }

                for(var i = 0; i<data.length; i++)
                {
                    newData.push(data[i].value )
                }

                this.setState({ cpuValues: newData})
                //this.setState({ ramValues: newData})
                this.setState({ currentCPU: data[data.length-1].value})
            }
            this.gettingData = false;
        });

        Client.getRamUsage("", data => {
            if(this._isMounted)
            {
                var newData = [];

                while(newData.length+data.length<100)
                {
                    newData.push(0)
                }

                for(var i = 0; i<data.length; i++)
                {
                    newData.push(data[i].value )
                }

                this.setState({ ramValues: newData})
                //this.setState({ ramValues: newData})
                this.setState({ currentRAM: data[data.length-1].value})
            }
            this.gettingData = false;
        });
    }
      
    inputOutputTemplate(rowData, column)
    {
        if(rowData['inout']==true)
        {
            return	<div><i className="pi pi-sign-in" style={{color:'#aaccff'}}/></div>
        }
        else
        {
            return	<div><i className="pi pi-sign-out" style={{color:'#aaffcc'}}/></div>
        }
    }

    renderGridItem(channel) 
    {
        const percent = Math.round(channel.value/2.5).toString() + "%";

        return (
            <div key={channel.id} style={{background:'#303030',padding:'5px'}}>
                <div>
                    <div style={{color:'#ffffff',padding:'0',margin:'0',textAlign:'left',float:'left',fontSize:'14px'}}>
                        {channel.id}
                    </div>
                    <div style={{color:'#999999',padding:'0',margin:'0',textAlign:'right',fontSize:'12px'}}>
                        {channel.value}
                    </div>
                </div>
                <div style={{width:percent, height:'5px', background:'#ffaa00'}}/>
            </div>
        );
    }
    
  	render()
	{
		//Server Offline, don't show anything
		if(!this.context.online)
		{
			return (	
				<div className="Content">
					<div className="InfoCard">
						<Card title="Server Offline">
							<div>There is no connection to the zactrack Server. Please connect again by setting the IP to the right address.</div>
						</Card>
					</div>
				</div>
				);
		}
        else
        {
            const chartData = {
                labels: this.timeAxis,
                datasets: [
                    {
                        label: 'CPU Usage',
                        data: this.state.cpuValues,
                        fill: true,
                        borderColor: '#FFA726',
                        backgroundColor: '#8f5600',
                    },
                    {
                        label: 'RAM Usage',
                        data: this.state.ramValues,
                        fill: true,
                        borderColor: '#26A7FF',
                        backgroundColor: '#00538a'
                    },
                    {
                        label: 'MAX',
                        data: this.state.maxValues,
                        fill: false,
                        borderColor: 'FFFFFF'
                    }
                ]   
            };

            var options = {
                animation: false
            };

            return (
                <div className="Content">
                    <h1 style={{color: "#FFA726"}}>Current CPU: {this.state.currentCPU} % </h1>
                    <h1 style={{color: "#26A7FF"}}>Current RAM: {this.state.currentRAM} % </h1>
                    
                    <ScrollPanel style={{width: '100%', height: '100%'}}>      
                            <Chart  options={options} height="80" animate="false" type="line" data={chartData}  />
                    </ScrollPanel>
				</div>    
            );
            
        }    
	}
}

ResourceMonitor.contextType = AppContext;
export default ResourceMonitor;