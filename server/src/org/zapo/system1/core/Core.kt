package org.zapo.system1.core


import org.zapo.system1.fixture.FixtureLibrary
import org.zapo.system1.api.APIManager
import org.zapo.system1.api.APIServer


object Core
{
    private var init : Boolean = false
    private lateinit var api : APIServer


    fun init()
    {
        if(init)
        {
            return
        }

        APIManager.startAPI()

        FixtureLibrary("fixturelib").createLibrary()

        init = true
    }
}