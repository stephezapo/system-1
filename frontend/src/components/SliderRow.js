import React from "react";
import Client from "../Client";
import '../index.css';
import {Slider} from 'primereact/slider';
import {Checkbox} from 'primereact/checkbox';


class SliderRow extends React.Component 
{
  	state = {
        paramID: this.props.paramID,
        paramValue: this.props.paramValue,
        paramMin: this.props.paramMin,
        paramMax: this.props.paramMax
      };


    handleOnSlide = (value) => {
        this.setState({paramValue: value})
        Client.setVisualParameter({'id': this.state.paramID, 'value': value, 'min': this.state.paramMin, 'max': this.state.paramMax});
    }
    
    handleOnCheck = (checked) => {
        this.setState({paramValue: checked ? 1 : 0})
        Client.setVisualParameter({'id': this.state.paramID, 'value': checked ? 1 : 0, 'min': this.state.paramMin, 'max': this.state.paramMax});
    }

    render()
    {
        if(this.state.paramMax-this.state.paramMin===1) //only on/off parameter
        {
            return (
                <tr key={this.state.paramID}>
                    <th width="20%" align="left">{this.state.paramID}</th>
                    <th width="100%" align="right"><Checkbox onChange={(e) => this.handleOnCheck(e.checked)} checked={this.state.paramValue>0}/></th>
                </tr>
                );
            
        }
        else
        {
            return (
                <tr key={this.state.paramID}>
                    <th width="20%" align="left">{this.state.paramID}</th>
                    <th width="80%"><Slider value={this.state.paramValue} min={this.state.paramMin} max={this.state.paramMax} onChange={(e) => this.handleOnSlide(e.value)}/></th>
                    <th width="20%" alignt="right">{this.state.paramValue}</th>
                </tr>
                );
        }
        
    }
}

export default SliderRow;