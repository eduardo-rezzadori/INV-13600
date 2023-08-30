class Log {


    static Colors = {
        Blue: {
            Blue: "color: #0000FF",
            Olive: "color: #808000",
            SkyBlue: "color: #87CEEB",
            DarkBlue: "color: #00008B",
            DarkCyan: "color: #008B8B",
            SlateBlue: "color: #6A5ACD",
            LightCyan: "color: #E0FFFF",
            CadetBlue: "color: #5F9EA0",
            SteelBlue: "color: #4682B4",
            AliceBlue: "color: #F0F8FF",
            Turquoise: "color: #40E0D0",
            BlueViolet: "color: #8A2BE2",
            DodgerBlue: "color: #1E90FF",
            Aquamarine: "color: #7FFFD4",
            PowderBlue: "color: #B0E0E6",
            SlateBlue1: "color: #836FFF",
            DeepSkyBlue: "color: #00BFFF",
            MidnightBlue: "color: #191970",
            PaleTurquoise: "color: #E0FFFF",
            DarkSlateBlue: "color: #483D8B",
            DarkTurquoise: "color: #00CED1",
            CornflowerBlue: "color: #6495ED",
            LightSteelBlue: "color: #B0C4DE",
            MediumSlateBlue: "color: #7B68EE",
            MediumTurquoise: "color: #48D1CC",
            MediumAquamarine: "color: #66CDAA",
        },
        Green: {
            Cyan: "color: #00FFFF",
            Teal: "color: #008080",
            Lime: "color: #00FF00",
            Green: "color: #008000",
            SeaGreen: "color: #2E8B57",
            PaleGreen: "color: #98FB98",
            DarkGreen: "color: #006400",
            LimeGreen: "color: #32CD32",
            LawnGreen: "color: #7CFC00",
            Chartreuse: "color: #7FFF00",
            LightGreen: "color: #90EE90",
            ForestGreen: "color: #228B22",
            GreenYellow: "color: #ADFF2F",
            YellowGreen: "color: #9ACD32",
            SpringGreen: "color: #00FF7F",
            DarkSeaGreen: "color: #8FBC8F",
            LightSeaGreen: "color: #20B2AA",
            MediumSeaGreen: "color: #3CB371",
            MediumSpringGreen: "color: #00FA9A",
            DarkOliveGreen: "color: #556B2F",
        },
        Red: {
            Red: "color: #FF0000",
            Salmon: "color: #FA8072",
            Crimson: "color: #DC143C",
            DarkRed: "color: #8B0000",
            FireBrick: "color: #B22222",
            OrangeRed: "color: #FF4500",
            IndianRed: "color: #CD5C5C",
            LightCoral: "color: #F08080",
            DarkSalmon: "color: #E9967A",
            PaleVioletRed: "color: #DB7093",
            MediumVioletRed: "color: #C71585",
        },
        Pink: {
            Pink: "color: #FFC0CB",
            HotPink: "color: #FF69B4",
            DeepPink: "color: #FF1493",
            LightPink: "color: #FFB6C1",
        },
        Orange: {
            Coral: "color: #FF7F50",
            Orange: "color: #FFA500",
            Tomato: "color: #FF6347",
            DarkOrange: "color: #FF8C00",
            LightSalmon: "color: #FFA07A",
        },
        Greyscale: {
            Gray: "color: #808080",
            Snow: "color: #FFFAFA",
            Beige: "color: #F5F5DC",
            Black: "color: #000000",
            Ivory: "color: #FFFFF0",
            Linen: "color: #FAF0E6",
            Azure: "color: #F0FFFF",
            grey11: "color: #1C1C1C",
            grey31: "color: #4F4F4F",
            DimGray: "color: #696969",
            OldLace: "color: #FDF5E6",
            Lavender: "color: #E6E6FA",
            Honeydew: "color: #F0FFF0",
            DarkGray: "color: #A9A9A9",
            Seashell: "color: #FFF5EE",
            MistyRose: "color: #FFE4E1",
            SlateGray: "color: #708090",
            MintCream: "color: #F5FFFA",
            WhiteSmoke: "color: #F5F5F5",
            GhostWhite: "color: #F8F8FF",
            FloralWhite: "color: #FFFAF0",
            DarkSlateGray: "color: #2F4F4F",
            LavenderBlush: "color: #FFF0F5",
        },
        Yellow: {
            Gold: "color: #FFD700",
            Khaki: "color: #F0E68C",
            Yellow: "color: #FFFF00",
            Moccasin: "color: #FFE4B5",
            DarkKhaki: "color: #BDB76B",
            Goldenrod: "color: #DAA520",
            PeachPuff: "color: #FFDAB9",
            PapayaWhip: "color: #FFEFD5",
            LightYellow: "color: #FFFFE0",
            LemonChiffon: "color: #FFFACD",
            DarkGoldenrod: "color: #B8860B",
            PaleGoldenrod: "color: #EEE8AA",
            LightGoldenrodYellow: "color: #FAFAD2",
        },
        Brown: {
            Tan: "color: #D2B48C",
            Peru: "color: #CD853F",
            Wheat: "color: #F5DEB3",
            Brown: "color: #A52A2A",
            Bisque: "color: #FFE4C4",
            Sienna: "color: #A0522D",
            Maroon: "color: #800000",
            Cornsilk: "color: #FFF8DC",
            Chocolate: "color: #D2691E",
            RosyBrown: "color: #BC8F8F",
            BurlyWood: "color: #DEB887",
            SandyBrown: "color: #F4A460",
            SaddleBrown: "color: #8B4513",
            NavajoWhite: "color: #FFDEAD",
            AntiqueWhite: "color: #FAEBD7",
            BlanchedAlmond: "color: #FFEBCD",
        },
        Purple: {
            Plum: "color: #DDA0DD",
            Orchid: "color: #DA70D6",
            Indigo: "color: #4B0082",
            Purple: "color: #A020F0",
            Violet: "color: #EE82EE",
            Magenta: "color: #FF00FF",
            Thistle: "color: #D8BFD8",
            DarkViolet: "color: #9400D3",
            DarkOrchid: "color: #9932CC",
            DarkMagenta: "color: #8B008B",
            MediumOrchid: "color: #BA55D3",
            MediumPurple: "color: #9370DB",
        }

    }

    /**
     * @param {String} msg mensagem que sera utilizada no log
     * @param {String} cor nome da propriedade cor. exemplo: Log.PaleGreen , caso a opcao seja de uma cor especifica é necessario passar uma string em hexadecimal. exemplo: #00FF00
     * @param {bool} corEspecifica parametro opicional para utilizar uma cor especifica no console.log
     * 
     * Exemplo de uma chamada do metodo : Log.color("Mensagem",this.Red)
     */
    static console(msg, cor, corEspecifica = false) {
        if (!corEspecifica) {
            console.log("%c" + msg, cor)
        } else {
            console.log("%c" + msg, `color: ${cor}`)
        }
    }
}

class Calc {

    /**
    * @param {Object} arrayElements vetor de elementos para calculo do desvio padrao
    *
    * Exemplo de uma chamada do metodo : RetornoDesvioPadrao = Calc.calcDesvioPadrao(VetorDeElementos)
    */

    static calcDesvioPadrao(arrayElements) {

        let numElements = arrayElements.length
        let somaElements = 0
        let calcMedia

        let somaDividendoDesvioPadrao = 0
        let desvioPadrao

        for (let cont = 0; cont < numElements; cont++) {
            somaElements = somaElements + arrayElements[cont]
        }

        calcMedia = somaElements / numElements

        for (let i = 0; i < numElements; i++) {
            somaDividendoDesvioPadrao = somaDividendoDesvioPadrao + Math.pow((arrayElements[i] - calcMedia), 2)
        }

        desvioPadrao = Math.sqrt((somaDividendoDesvioPadrao / numElements))

        return desvioPadrao
    }
}