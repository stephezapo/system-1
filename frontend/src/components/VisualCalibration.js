import React from "react";
import Client from "../Client";
import '../index.css';
import {ScrollPanel} from 'primereact/scrollpanel';
import {Card} from 'primereact/card';
import {ProgressBar} from 'primereact/progressbar';
import {AppContext} from '../AppContext'
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';


class VisualCalibration extends React.Component 
{
    _isMounted = false;

  	state = {
        status: [],
        showStartDialog: false,
        showStopDialog: false,
        showProceedDialog: false,
        info: [],
        debugOutput: ""
      };
    
    constructor()
    {
        super();

        this.updateInfo = this.updateInfo.bind(this);

        this.showStartDialog = this.showStartDialog.bind(this);
        this.hideStartDialog = this.hideStartDialog.bind(this);
        this.showStopDialog = this.showStopDialog.bind(this);
        this.hideStopDialog = this.hideStopDialog.bind(this);
        this.startCalibration = this.startCalibration.bind(this);
        this.stopCalibration = this.stopCalibration.bind(this);
        this.proceedCalibrationGroup = this.proceedCalibrationGroup.bind(this);
        this.hideProceedDialog = this.hideProceedDialog.bind(this);
    }

  	componentDidMount()
  	{
          this._isMounted = true;

          this.interval = setInterval(() => this.updateInfo(), 500);
    }

    componentWillUnmount()
    {
        this._isMounted = false;

        clearInterval(this.interval);
    }

    updateInfo()
	{
		Client.getCameraCalibrationInfo(data => {
            this.setState({info: data});

            if(this.state.info.status===2) //awaiting client confirmation to proceed
            {
                this.setState({showProceedDialog: true});
            }
        })
        
        Client.getCameraStatus(data => {
            this.setState({status: data});
        })

        Client.getVisualDebugOutput(data => {
            if(this._isMounted)
            {
                if(this.state.debugOutput!=data.output)
                {
                    this.setState({ debugOutput: data.output})
                    if(this.messagesEnd)
                    {
                        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
        })
	}

    handleClick()
    {
        Client.grabFrame();
    }

    showStartDialog()
    {
        this.setState({showStartDialog: true});
    }

    hideStartDialog()
    {
        this.setState({showStartDialog: false});
    }

    startCalibration(automatic)
    {
        Client.startCameraCalibration({auto: automatic});
        this.setState({showStartDialog: false});
    }

    stopCalibration()
    {
        Client.stopCameraCalibration();
        this.setState({showStopDialog: false});
    }

    proceedCalibrationGroup()
    {
        Client.proceedCalibrationGroup();
        this.setState({showProceedDialog: false});
    }

    hideProceedDialog()
    {
        this.setState({showProceedDialog: false});
    }

    showStopDialog()
    {
        this.setState({showStopDialog: true});
    }

    hideStopDialog()
    {
        this.setState({showStopDialog: false});
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

        const startFooter = (
            <div>
                <Button label="Automatic" onClick={() => this.startCalibration(true)} />
                <Button label="Manual" onClick={() => this.startCalibration(false)} />
            </div>
        );

        const stopFooter = (
            <div>
                <Button label="Stop" onClick={this.stopCalibration} />
            </div>
        );

        const proceedFooter = (
            <div>
                <Button label="Proceed" onClick={this.proceedCalibrationGroup} />
            </div>
        );

        

        var calibrationRunning = false;

        if(this.state.info)
        {
            calibrationRunning = this.state.info.status>0;
        }

        var title = calibrationRunning ? "Calibration running" : "Calibration stopped";

        var details = (<div></div>);
        if(calibrationRunning && this.state.info.automatic)
        {
            if(this.state.info.status===3) // calculating
            {
                details = ( <div>
                    Calculating result
                    <br/><br/>
                    <ProgressBar value={this.state.info.calculationPercent} showValue={false} style={{'height':'10px'}}/>
                </div>);
            }
            else //capturing frames
            {
                var cuePercents = (100.0*(this.state.info.currentGroupFrame+1.0))/this.state.info.currentGroupFrames;
                var groupPercents = (100.0*(this.state.info.currentGroup+1.0))/this.state.info.totalGroups;
                
                details = ( <div>
                                Capturing frame {this.state.info.currentGroupFrame+1} of {this.state.info.currentGroupFrames}
                                <br/><br/>
                                <ProgressBar value={cuePercents} showValue={false} style={{'height':'10px'}}/>
                                <br/>
                                <br/>
                                Processing group {this.state.info.currentGroup+1} of {this.state.info.totalGroups}
                                <br/><br/>
                                <ProgressBar value={groupPercents} showValue={false} style={{'height':'10px'}}/> 
                            </div>);
            }
        }
        else if(calibrationRunning && !this.state.info.automatic)
        {
            details = ( <div>
                            Manual Calibration not yet implemented
                        </div>);
        }
        else
        {
            if(this.state.info.calibrated)
            {
                details = (<div>
                            Camera is calibrated.
                        </div>);
            }
            else
            {
                details = (<div>
                            Camera is not calibrated.
                        </div>);
            }
        }

        var text = this.state.debugOutput
        
        return (
            <div className="Content">
                <br/> 
                <Button className="p-button-success" label="Start Calibration" disabled={calibrationRunning} onClick={this.showStartDialog} icon="pi pi-table" style={{'width':'100%'}} />
                <br/>
                <br/>
                <Button className="p-button-danger" label="Stop Calibration" disabled={!calibrationRunning} onClick={this.showStopDialog} icon="pi pi-times-circle" style={{'width':'100%'}} />
                <br/>
                <br/>
                <Card title={title}>
                    <br/>
                    {details}
                </Card>
                <br/>
                <br/>
                <ScrollPanel className="ContentSection" style={{'flexGrow': '1','background':'#111111','color':'#ffffff','height':'300px','padding':'10px'}}>     
                    {text.split("\n").map((i,key) => {
                        return <div key={key}>{i}</div>;
                    })}
                    <div id="list-end" ref={(el) => { this.messagesEnd = el;}}/>
                </ScrollPanel>

                <Dialog header="Calibration Start" footer={startFooter} visible={this.state.showStartDialog} style={{width: '80%'}} modal={true} onHide={this.hideStartDialog}>
                    Select calibration mode
                </Dialog>
                <Dialog header="Calibration Stop" footer={stopFooter} visible={this.state.showStopDialog} style={{width: '80%'}} modal={true} onHide={this.hideStopDialog}>
                    Do you really want to stop the calibration process?
                </Dialog>
                <Dialog header="Proceed Calibration" footer={proceedFooter} visible={this.state.showProceedDialog} style={{width: '80%'}} modal={true} closable={false} onHide={this.hideStopDialog}>
                    All positions of calibration group {this.state.info.currentGroup+1} / {this.state.info.totalGroups} have been captured.
                    <br/>
                    Adjust calibration setup and proceed to next group.
                </Dialog>
            </div>
            );
    }
}

VisualCalibration.contextType = AppContext;
export default VisualCalibration;