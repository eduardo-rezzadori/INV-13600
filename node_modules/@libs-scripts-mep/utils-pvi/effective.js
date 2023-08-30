class Effective {

    static ERPDataExists() {
        return sessionStorage.getItem("ERPData")
    }

    static setERPData(callback) {
        this.requestERP((dataErp) => {
            if (dataErp != null) {
                sessionStorage.setItem("ERPData", dataErp)
                callback(true)
            } else {
                callback(false)
            }
        })
    }

    static getParsedERPData(callback) {
        if (sessionStorage.getItem("ERPData") != null) {
            let ERPDataUnparsed = sessionStorage.getItem("ERPData")
            let ERPDataParsed = JSON.parse(ERPDataUnparsed)
            callback(ERPDataParsed)
        } else {
            callback(false)
        }
    }

    static getProductCode() {
        return sessionStorage.getItem("ProductCode")
    }

    static setProductData(ERPdata) {
        if (ERPdata.hasOwnProperty("Information")) {
            //Caso for passado um número de serie para configuracao
            sessionStorage.setItem("ProductCode", ERPdata.Information.ProductCode)
            sessionStorage.setItem("SerialNumber", ERPdata.Code)
        } else if (ERPdata.hasOwnProperty("Product")) {
            //Caso for passado um número de uma OP para configuracao
            sessionStorage.setItem("ProductCode", ERPdata.Product.ProductCode)
        }
    }

    /**
     * retorna dados do servidor para OP ou numero de serie
     * @param {function} callback 
     */
    static requestERP(callback) {
        let number = prompt("Informe o Número de Serie da Peca ou OP do Lote.\nEx [OP]: OP-123456-1\nEx [SN]: 1000001234567")
        let httpReq = new XMLHttpRequest()
        let URL = null

        if (number != null) {
            if (number.toString().match(/[1][0][0][0][0][0-9]{8}/) != null) {
                URL = "http://rast.inova.ind.br/api/effective/products/" + number.toString()
            } else if (number.match(/[o|O][p|P][a-zA-Z]?[a-zA-Z]?[[a-zA-Z]?[-][0-9]{1,7}[-][0-1]/) != null) {
                URL = "http://rast.inova.ind.br/api/effective/orders/0/" + number.toString()
            } else {
                window.alert("Número informado nao e nem um número de serie, nem uma OP")
                location.reload()
            }
        } else {
            window.alert("Número informado nao informado.")
            location.reload()
        }

        httpReq.onreadystatechange = function () {
            if (httpReq.readyState == 4 && httpReq.status == 200) {
                callback(httpReq.responseText)
                console.log("requisicao HTTP: " + httpReq.statusText)

            } else if (httpReq.status.toString().match(/[3-5][0-9]{2}/) != null) {
                callback(null)
            }
        }

        httpReq.open("GET", URL, true)
        httpReq.send()
    }
}