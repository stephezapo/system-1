package core.fixtures.library

import core.util.FileUtils
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.Paths.*

class FixtureLibrary(libraryDirectory: String) {

    var libraryDir = libraryDirectory

    fun createLibrary() {

        val exportDir = "$libraryDir/extracted"
        //First delete and recreate the files directory for extracted GDTFs
        val fileDir = File(exportDir)
        if(fileDir.exists()) {
            FileUtils.deleteDirectory(fileDir)
        }

        val path = Paths.get(exportDir);
        Files.createDirectory(path);

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