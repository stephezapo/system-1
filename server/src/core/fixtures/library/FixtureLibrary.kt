package core.fixtures.library

import core.util.FileUtils
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import javax.xml.parsers.DocumentBuilderFactory

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

        //Iterate through extracted files and find manufacturer and model details in the respective description XML
        val manufacturers = ArrayList<Manufacturer>()
        val models = ArrayList<Model>()
        File("$libraryDir/extracted").walk().forEach {
            val xml = File(it.path + "/description.xml")
            if(xml.exists()) {
                parseXmlFile(xml, models)
            }
        }
    }

    private fun parseFile(file : File) {
        println("Parsing file ${file.name}")

        FileUtils.unzip(file.absolutePath, "$libraryDir/extracted/${file.nameWithoutExtension}")
    }

    private fun parseXmlFile(file : File, manufacturers: ArrayList<Manufacturer>, models: ArrayList<Model>) {
        val dbFactory = DocumentBuilderFactory.newInstance()
        val dBuilder = dbFactory.newDocumentBuilder()
        val doc = dBuilder.parse(file)

        val fTypeTag = doc.getElementsByTagName("FixtureType")
        if(fTypeTag.length>0) {
            val manufacturer = fTypeTag.item(0).attributes.getNamedItem("Manufacturer").nodeValue
            //val model = fTypeTag.item(0).attributes.getNamedItem("Name").nodeValue
            manufacturers.add(Manufacturer(manufacturer))
            //models.add(Model(model))
        }
    }
}