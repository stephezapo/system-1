package org.zapo.system1.api;

/**
 * To avoid strange compiler/linker errors, there needs to be a Java wrapper class around the API thread in order to be
 * called from Kotlin
 */
public class APIManager
{
    public static void startAPI()
    {
        try
        {
            APIServer server = new APIServer(1234);
            server.start();
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }
}
