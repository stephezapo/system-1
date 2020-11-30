package org.zapo.system1.api.rest

import io.ktor.auth.*


data class User(val name: String, val password: String, val other: String="default"): Principal
