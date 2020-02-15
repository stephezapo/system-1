package org.zapo.system1.api;


import org.apache.thrift.TException;
import org.zapo.system1.thrift.API;


public class APIHandler implements API.Iface
{
    @Override
    public void ping() throws TException
    {
        System.out.println("PING!");
    }
}
