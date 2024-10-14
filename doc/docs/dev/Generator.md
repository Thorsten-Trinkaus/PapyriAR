# QR-Generator

```mermaid
flowchart TB
    subgraph VISUALIZATION
        M1[[Marker 1]]
        M2[[Marker 2]]
        QR[[QR-Code]]
        PAP[[Papyrus]]
    end
    subgraph CREATE-A-VISUALIZATION
        subgraph QR-Generator
            Gen(generator.js)
        end
        eScrip[(eScriptorium)]
        subgraph FRAMEWORKS-QR
            QRSty(qr-code-styling.js)
            PDF(jspdf.umd.min.js)
        end
        Gen -- uses --> eScrip
        QR-Generator -- uses --o FRAMEWORKS-QR
    end
    Gen == produces ==> VISUALIZATION
```

The purpose of ***[tool](https://thorsten-trinkaus.github.io/PapyriAR/QR-Generator/)*** this tool is to create a visualization by providing the two markers and generating the QR-Code. Hence, this isn't directly involved in the process of displaying data in the augmented reality context, but is essential to even make these visualizations possible.

---

## The QR-Code

Centerpiece of this tool is, as the name suggests, the generation of the QR-Code. This QR-Code will always link to the AR part of the project using the base URL 
```url
    https://thorsten-trinkaus.github.io/PapyriAR/AR/
```
In addition to this URL, the QR-Code needs to store enough information, such that the AR part can identify the used papyrus. For this, we use the *"data"* query parameter: 
```url
https://thorsten-trinkaus.github.io/PapyriAR/AR/?data=<Identifying-Info>
```

Here, the ***Identifying-Info*** depends on the method used within the tool.

- If the Trismegistos method is used, we only need to save the Trismegistos identifier, as from there, we can get both *.xml* files from the repository. Obviously, this method doesn't allow for any access to the eScriptorium data, which makes it impossible to correctly display the transcription. Therefor, visualizations created through this method will only display meta data. A URL would look like this:
```url
https://thorsten-trinkaus.github.io/PapyriAR/AR/?data=2020
```

- If the eScriptorium method is used, the amount of needed data is much higher. As stated in the ***[Introduction](./Introduction.md)***, the eScriptorium *.xml* file needs to be provided by the user and can't be accessed at the runtime of the AR part. Hence, all the needed data from this file needs to be stored in the URL. We store the data in the form of:
```url
TrismegistosIdentifier_PixelWidth-of-the-image_PixelHeight-of-the-image_Width-of-line1!xPos-of-line1!yPos-of-line1!Rotation-of-line1_line2_...
```

An example for the eScriptorium method would look like this:
```url
https://thorsten-trinkaus.github.io/PapyriAR/AR/?data=2140_1587_2296_1064!855!358.5!-2.53_904!822!484.5!-1.71_1134!929!609!-2.22_1031!862.5!750.5!-0.94_621!662.5!890.5!-1.57_1170!913!1010.5!-1.71_1099!884.5!1209.5!-0.26_828!766!1315.5!-0.35_964!839!1450!0.71_604!871!1590.5!-0.662140_1587_2296_1064!855!358.5!-2.53_904!822!484.5!-1.71_1134!929!609!-2.22_1031!862.5!750.5!-0.94_621!662.5!890.5!-1.57_1170!913!1010.5!-1.71_1099!884.5!1209.5!-0.26_828!766!1315.5!-0.35_964!839!1450!0.71_604!871!1590.5!-0.66
```

To actually generate the QR-Code we use the framework ***[qr-code-styling](https://github.com/kozakdenys/qr-code-styling)*** and render the generated Code to an **HTMLImageElement**, which than can be downloaded as a *.png* file.

---

## URL shortener

When you take a look at the example URL for the eSciptorium example, you may realise that these URLs can get pretty big pretty fast, which also creates big and complex QR-Codes. Eventhough we can generate these QR-Codes, they can get so complex that they aren't easy to scan anymore, which defeats the purpose of the QR-Code. 

We use the open-source URL shortener ***[spoo.me](https://github.com/spoo-me/url-shortener)*** to counteract this problem. This service helps to keep the URLss as short as possible, which makes for smaller and more readable QR-Codes. This is an optional choice to the user, because we don't controll the service provided by ***[spoo.me](https://github.com/spoo-me/url-shortener)***, which isn't perfect.

---

## Downloads

We allow the user to download the two markers *.png* files at any time, as they are just static images, that stay the same for all the papyri.

The QR-Code obviously first needs to be generated, before allowing the user to download it.

We also offer the option to download both the two markers and the QR-Code together as a single *.pdf* file. The goal of this option is to make printing the components, needed for a visualization, as easy as possible. To create a PDF and to copy the HTMLImageElements into the PDF, we use the framework ***[jsPDF](https://github.com/parallax/jsPDF)***. This framework also directly handles the download of the *.pdf* file.

---

## eScriptorium

This section doesn't realy matter, but provides some quality of life improvements for the user. When the user uploads their eScriptorium *.xml* file, we check the file and make sure the file can acctually be used for this project. As the eScriptorium is still work in progress, there are files that can't be used simply because the data inside these files is wrong. An example for this would be:

can be used                   | can't be used
:----------------------------:|:----------------------------:
![eScript2](/img/eScript2.png)|![eScript3](/img/eScript3.png)|

*The images of **["Demetrios a Zenon"](https://papyri.info/ddbdp/psi;4;404)** and **["Kritias a Zenon"](https://papyri.info/ddbdp/psi;4;345)** are licensed by the **[Heidelberger Gesamtverzeichnis der griechischen Papyrusurkunden Ägyptens](https://aquila.zaw.uni-heidelberg.de/start)** under **[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)**.*

---

For more information about the generator, look at ***[generator.js](../jsDoc/generator.md)***.