export default class Util
{
    static isEmpty(obj) 
    {
        for(var key in obj)
        {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    /*
    * Function to convert Thrift's I64 to a Javascript-compatible data format.
    */
    static parseInt64(int)
    {
        var value = 0;

        for(var i = 7; i>=0; i--)
        {
            value+=((int.buffer.data[7-i] )) << i*8;
        }
        
        if(value<0)
        {
            value += 1;
        }

        return value;
    }

    static componentToHex(c) 
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    static rgbToHex(r, g, b) 
    {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    static rgbToJSHex(r, g, b) 
    {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}