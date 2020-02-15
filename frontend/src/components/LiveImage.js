import React from "react";
import '../index.css';


class LiveImage extends React.Component 
{
  	state = {
        imageStatus: "Waiting ...",
        image: ""
      };
      
    //ws = new WebSocket('ws://'+window.location.hostname+':3000/frame');
    ws = new WebSocket('ws://127.0.0.1:3000/frame');
    _isMounted = false;


  	componentDidMount()
  	{
        this.ws.onopen = () => {
            console.log('Websocket connected')
            this.setState({imageStatus: "Waiting for image feed ..."})
        }

        this.ws.onmessage = evt => {

            this.setState({image: evt.data});
            this.setState({imageStatus: "Receiving"})
        }

        this.ws.onclose = () => {
            console.log('Websocket disconnected')
            this.setState({imageStatus: "Websocket closed"})
        }

        this._isMounted = true;
    }

    componentWillUnmount()
    {
        this.ws.close();
        
        this._isMounted = false;
    }

    render()
    {
        if(this._isMounted)
        {
            return (
                <div>
                    <img src={this.state.image} alt="Live Stream" style={{'width':'100%'}}/>
                </div>
                );
        }
        else
        {
            return (
                <div/>
                );
        }
        
    }
}

export default LiveImage;