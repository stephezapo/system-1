package org.zapo.lumosmaxima;

import javafx.application.Application;
import javafx.stage.Stage;
import org.zapo.lumosmaxima.ui.window.ScreenManager;


public class Core {

    private static Core instance;

    private boolean init = false;
    private ScreenManager screens;


    private Core() {

    }

    public static Core Get() {
        if(instance==null) {
            instance = new Core();
        }

        return instance;
    }

    public void init(Stage stage, Application appContext)
    {
        if(init)
        {
            return;
        }

        screens = new ScreenManager(stage, appContext);
        screens.showWindow(ScreenManager.WindowType.CONTROL);
        screens.showWindow(ScreenManager.WindowType.SCREEN1);

        init = true;
    }

}
