// TimeBilling API
require('dotenv').config();

function endPoints(version,endPoint,params){

    let url = '';

    if (version === 'v3'){

        url = `https://${process.env.SUBDOMAIN}.timebillingapp.com/api/v3/${endPoint}?${params}`;

    } else if (version === 'v2') {

        url = `https://${process.env.SUBDOMAIN}.timebillingapp.com/api/v2/${endPoint}?${params}`;

    } else if (version === 'v2-lemonsuite') {

        url = `https://${process.env.SUBDOMAIN}.lemonsuiteapp.com/suite/api/v2/${endPoint}?${params}`;

    }

    return url;

};

function header (version) {

    let headers = '';

    if (version === 'v3') {

        headers =   `accept: 'application/json',
                    'accept-language': 'es-ES,es;q=0.9,en;q=0.8,fr;q=0.7',
                    authorization: 'Bearer ${process.env.V3APIKEY}',
                    origin: 'https://developer.timebillingapp.com',
                    referer: 'https://developer.timebillingapp.com/'`

    
    } else if (version === 'v2'){


        headers =   
                    `authtoken:${process.env.V2APIKEY}
                    Referer:https://${process.env.SUBDOMAIN}.timebillingapp.com/`

    }  else if (version === 'v2-lemonsuite'){

        headers =   
                    `authtoken:${process.env.V2APIKEY}
                    Referer:https://${process.env.SUBDOMAIN}.lemonsuiteapp.com/suite`

    };

    return headers;

};

// ************************************************************ Export

function cmfUrl(code,year){

    //codes: uf, dolar, utm || year : YYYY

    const url = `https://api.cmfchile.cl/api-sbifv3/recursos_api/${code}/${year}?apikey=${process.env.CMFAPIKEY}&formato=json`;

    return url;
}

module.exports = {
    endPoints,
    header,
    cmfUrl
};


