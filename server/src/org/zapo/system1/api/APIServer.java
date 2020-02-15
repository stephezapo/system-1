package org.zapo.system1.api;


import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TTransportException;
import org.zapo.system1.thrift.API;


public class APIServer extends Thread
{
    private APIHandler handler;
    private TServerSocket serverTransport;
    private API.Processor processor;
    private TThreadPoolServer.Args args;
    private TServer server;


    public APIServer(int port) throws TTransportException
    {
        handler = new APIHandler();
        processor = new API.Processor(handler);
        serverTransport = new TServerSocket(port);
        args = new TThreadPoolServer.Args(serverTransport);
        args.processor(processor);
        args.minWorkerThreads(0);
        server = new TThreadPoolServer(args);
        setName("system-1 API");
    }

    @Override
    public synchronized void start()
    {
        super.start();
    }

    @Override
    public void run()
    {
        server.serve();
    }

    public void shutdown()
    {
        server.stop();
    }
}