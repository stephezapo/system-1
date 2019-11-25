package core.fixtures.library

import java.io.File

class FixtureLibrary(libraryDirectory: String) {

    var libraryDir = libraryDirectory

    fun createLibrary() {

        //First delete and recreate the files directory for extracted GDTFs
        val fileDir = File("$libraryDir/extracted")
        if(fileDir.exists()) {
            FileUtils.deleteDirectory(fileDir)
        }

        fileDir.mkdir()

        //Iterate through all files in the library directory
        File("$libraryDir/gdtf").walk().forEach {
            if(it.name.endsWith(".gdtf", true)) {
                parseFile(it)
            }
        }
    }

    private fun parseFile(file : File) {
        println("Parsing file ${file.name}")

        FileUtils.unzip(file.absolutePath, "$libraryDir/extracted/${file.nameWithoutExtension}")
    }
}