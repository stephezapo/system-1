package core.fixtures.library

import java.io.File

class FixtureLibrary(libraryDirectory: String) {

    var libraryDir = libraryDirectory

    fun createLibrary() {
        //Iterate through all files in the library directory
        File("$libraryDir/gdtf").walk().forEach {
            if(it.name.endsWith(".gdtf", true)) {
                parseFile(it)
            }
        }
    }

    private fun parseFile(file : File) {
        println("Parsing file ${file.name}")

        ZipFile.unzip(file, "$libraryDir/files")
    }
}