package org.zapo.system1.api.rest

import io.ktor.application.ApplicationCall
import io.ktor.auth.authentication


val ApplicationCall.user get() = authentication.principal<User>()