package core.fixtures.library

data class Manufacturer(val manufacturer: String)
data class Model(val name: String, val manufacturer: Manufacturer, val description: String, val thumbnail: String, val modes : ArrayList<Mode>)
data class Mode(val name: String)
