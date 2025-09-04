require('dotenv').config();
const axios = require ('axios');
const fs = require("node:fs");
const auxiliar = require ('./auxiliar');
const select = require ('../db/select');
const marcasDeTiempo = []; // para limitar las peticiones
const pageRecords = 100;

//global functions

async function limitarPeticiones() {
    //La limitación es hacer 10 peticiones por segundo, pero por seguridad estamos haciendo sólo 9 cada 900ms
    
    let maxPeticiones = 9
    let maxIntervalo = 900 //ms
    return new Promise((resolve) => {

        const intentar = () => {
        const ahora = Date.now();

        // Eliminar marcas de tiempo que ya tengan más de 900ms 
        while (marcasDeTiempo.length > 0 && (ahora - marcasDeTiempo[0]) >= maxIntervalo) {

            marcasDeTiempo.shift();

        }

      // Si no hemos llegado a 9 peticiones en la ventana de 1s, podemos hacer la petición. La restriccion es 10, pero por seguridad usamos 9
        if (marcasDeTiempo.length < maxPeticiones) {
      
            marcasDeTiempo.push(ahora);
            resolve();
      
        } else {

        // Si ya hay 10 peticiones en el último segundo, esperamos a que se cumpla el minuto de la más antigua.
        const tiempoEspera = maxIntervalo - (ahora - marcasDeTiempo[0]);
        // Vuelve a intentar después de `tiempoEspera`

        setTimeout(intentar, tiempoEspera);
      }
    
    };

        intentar();
  
    });

}

async function usersList(){ //sólo se usa para tarer el listado de usuarios y luego consultar su detalle con la función users

    var initPage = 1;
    var data = {};
    var usersList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','users','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                usersList.push(data);
                initPage++;
            };

            usersList = usersList.flat();

        } while (data.length > 0);
   
        return usersList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function projectsList(){ //sólo se usa para tarer el listado de proyectos y luego consultar su detalle con la función projects

    var initPage = 1;
    var data = {};
    var projectList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','projects','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                projectList.push(data);
                console.log('page: ' + initPage + ' processed');
                initPage++;
            };

        } while (data.length > 0);

        projectList = projectList.flat();
   
        return projectList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function invoicesList(){ //sólo se usa para tarer el listado de Notas de Cobro y luego consultar su detalle con la función invoices

    var initPage = 1;
    var data = {};
    var invoicesList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','invoices','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                invoicesList.push(data);
                console.log('page: ' + initPage + ' processed');
                initPage++;
            };

        } while (data.length > 0);

        invoicesList = invoicesList.flat();
   
        fs.writeFile(`./jsonFiles/invoicesList.json`,JSON.stringify(invoicesList),(err) => {

                if(err){
                
                    throw new Error(err);
                
                }else{
                
                    console.log('invoiceList Saved on JSON File');
                
                }

            }); 


        return invoicesList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function billingsDocumentsList(){ //sólo se usa para tarer el listado de Facturas y luego consultar su detalle con la función billingDocuments

    var initPage = 1;
    var data = {};
    var billingDocumentsList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','billing_documents','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                billingDocumentsList.push(data);
                console.log('page: ' + initPage + ' processed');
                initPage++;
            };

        } while (data.length > 0);

        billingDocumentsList = billingDocumentsList.flat();
   
        return billingDocumentsList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

//endpoints

async function holdings(){

    var initPage = 1;
    var data = {};
    var holdingList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','holdings','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                holdingList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        holdingList = holdingList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/holdings.json`,JSON.stringify(holdingList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('holdings Saved on JSON File');
            
            }

        }); 

        await select.insertBatchHoldings(holdingList);

        console.log('holdings: ' + holdingList.length);
    
        return holdingList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function clients(){

    var initPage = 1;
    var data = {};
    var clientsList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','clients','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                clientsList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        clientsList = clientsList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/clients.json`,JSON.stringify(clientsList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('clients Saved on JSON File');
            
            }

        }); 

        await select.insertBatchClients(clientsList);

        console.log('clients: ' + clientsList.length);
    
        return clientsList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function clientsEntitiesAndContacs(){

    const clientsId = await select.getClientsId();
    var entitiesData = {};
    var contactsData = {};
    var entitiesList = [];
    var contactsList = [];
    const entitiesHeaders = auxiliar.header('v2');
    const contactsHeaders = auxiliar.header('v3');
    
    try{
        
        await Promise.all(clientsId.map(async (record) => {
            
            await limitarPeticiones();

            //Entities process
            var entitiesUrl = auxiliar.endPoints('v2','legal_entities','client_id=' + record); 
            var entitiesRes = await axios.get(entitiesUrl,{headers: entitiesHeaders});

            if(entitiesRes){
                entitiesData = entitiesRes.data;
                entitiesList.push(entitiesData);
            };

            //Contacts process
            var contactsUrl = auxiliar.endPoints('v3','clients/'+ record +'/contacts'); 
            var contactsRes = await axios.get(contactsUrl,{headers: contactsHeaders});

            if(contactsRes){
                contactsData = contactsRes.data;
                contactsList.push(contactsData);
            };

            console.log('clientId = ' + record + ' processed');

            })

        );

        entitiesList = entitiesList.flat();
        contactsList = contactsList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/clientsEntities.json`,JSON.stringify(entitiesList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('clientsEntities Saved on JSON File');
            
            }

        }); 

        fs.writeFile(`./jsonFiles/clientsContacs.json`,JSON.stringify(contactsList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('clientsContacts Saved on JSON File');
            
            }

        }); 

        await select.insertBatchClientsEntities(entitiesList);
        await select.insertBatchClientsContacts(contactsList);

        console.log('clientsEntities: ' + entitiesList.length);
        console.log('clientsContacts: ' + contactsList.length);
    
        return entitiesList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function rates(){

    var initPage = 1;
    var data = {};
    var ratesList = [];

    const headers = auxiliar.header('v2');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v2','fees/list','q=&current_page=' + initPage + '&page_size=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data.results;
                ratesList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        ratesList = ratesList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/rates.json`,JSON.stringify(ratesList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('rates Saved on JSON File');
            
            }

        }); 

        await select.insertBatchRates(ratesList);

        console.log('rates: ' + ratesList.length);
    
        return ratesList;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function ratesValues(){

    const ratesId = await select.getRatesId();
    var data = {};
    var ratesListByUser = [];
    var ratesListByCategory = [];
    const headers = auxiliar.header('v2');
    
    try{
        
        await Promise.all(ratesId.map(async (record) => {
            
            await limitarPeticiones();

            var url = `https://${process.env.SUBDOMAIN}.timebillingapp.com/api/v2/fees/${record};` //no se puede usar la url del auxiliar porque no tiene la misma estructura que el resto
            var res = await axios.get(url,{headers: headers});

            if(res){
                data = res.data;
                ratesListByUser.push(data.user_rates);
                ratesListByCategory.push(data.user_category_rates);
            };

            console.log('ratesId = ' + record + ' processed');

            })

        );

        ratesListByUser = ratesListByUser.flat();
        ratesListByCategory = ratesListByCategory.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/ratesByUser.json`,JSON.stringify(ratesListByUser),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('ratesByUser Saved on JSON File');
            
            }

        }); 

        fs.writeFile(`./jsonFiles/ratesByCategory.json`,JSON.stringify(ratesListByCategory),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('ratesByCategory Saved on JSON File');
            
            }

        }); 

        await select.insertBatchRatesByUser(ratesListByUser);
        await select.insertBatchRatesByCategory(ratesListByCategory);
    
        return ratesListByUser;

    } catch(error){

        console.error(error)
        return 'error'
        
    };

};

async function areas(){

    var initPage = 1;
    var data = {};
    var areasList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','project_areas','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                areasList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        areasList = areasList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/aeas.json`,JSON.stringify(areasList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('areas Saved on JSON File');
            
            }

        }); 

        await select.insertBatchAreas(areasList);

        console.log('areas: ' + areasList.length);
    
        return areasList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function categories(){

    var initPage = 1;
    var data = {};
    var categoriesList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','project_categories','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                categoriesList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        categoriesList = categoriesList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/categories.json`,JSON.stringify(categoriesList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('categories Saved on JSON File');
            
            }

        }); 

        await select.insertBatchCategories(categoriesList);

        console.log('categories: ' + categoriesList.length);
    
        return categoriesList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function usersCategories(){

    var initPage = 1;
    var data = {};
    var categoriesList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','user_categories','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                categoriesList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        categoriesList = categoriesList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/usersCategories.json`,JSON.stringify(categoriesList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('usersCategories Saved on JSON File');
            
            }

        }); 

        await select.insertBatchUsersCategories(categoriesList);

        console.log('userCategories: ' + categoriesList.length);
    
        return categoriesList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function usersTeams(){

    var initPage = 1;
    var data = {};
    var teamsList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','work_teams','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                teamsList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        teamsList = teamsList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/usersTeams.json`,JSON.stringify(teamsList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('usersTeams Saved on JSON File');
            
            }

        }); 

        await select.insertBatchUsersTeams(teamsList);

        console.log('userTeams: ' + teamsList.length);
    
        return teamsList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function users(){

    var data = {};
    const userList = await usersList();
    var usersDetails = [];

    const headers = auxiliar.header('v3');
    
    await Promise.all(userList.map(async (record) => {

        await limitarPeticiones();

        try {

          const url = auxiliar.endPoints('v3','users/' + record.id);
          const res = await axios.get(url, { headers });
  
          if (res) {

            data = res.data;
            usersDetails.push(data);
            console.log(record.id + ' completed');
  
          }

        } catch (error) {

          console.error(error);

        }

      })

    );
  
    usersDetails = usersDetails.flat();

    // Save json File

    fs.writeFile(`./jsonFiles/users.json`,JSON.stringify(usersDetails),(err) => {

        if(err){
        
            throw new Error(err);
        
        }else{
        
            console.log('users Saved on JSON File');
        
        }

    }); 

    await select.insertBatchUsers(usersDetails);

    console.log('users: ' + usersDetails.length);

    return usersDetails;

};

async function currencies(){

    var initPage = 1;
    var data = {};
    var curreciesList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','currencies','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                curreciesList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        curreciesList = curreciesList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/currencies.json`,JSON.stringify(curreciesList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('currencies Saved on JSON File');
            
            }

        }); 

        await select.insertBatchCurrencies(curreciesList);

        console.log('currencies: ' + curreciesList.length);
    
        return curreciesList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function banksAccounts(){

    var initPage = 1;
    var data = {};
    var banksAccountsList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','bank_accounts','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                banksAccountsList.push(data);
                initPage++;
            };

        } while (data.length > 0);

        banksAccountsList = banksAccountsList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/banksAccounts.json`,JSON.stringify(banksAccountsList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('banksAccounts Saved on JSON File');
            
            }

        }); 

        await select.insertBatchBanksAccounts(banksAccountsList);

        console.log('banksAccounts: ' + banksAccountsList.length);
    
        return banksAccountsList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function projects() {

    const projectList = await projectsList();
    const headers = auxiliar.header('v3');
    let projectsDetails = [];
  
    await Promise.all(projectList.map(async (record) => {

        await limitarPeticiones();

        try {

          const url = auxiliar.endPoints('v3','projects/' + record.id);
          const res = await axios.get(url, { headers });
  
          if (res) {

            projectsDetails.push(res.data);
            console.log(record.id + ' completed');
  
          }

        } catch (error) {

          console.error(error);

        }

      })

    );
  
    projectsDetails = projectsDetails.flat();

    // Save json File

    fs.writeFile(`./jsonFiles/projects.json`,JSON.stringify(projectsDetails),(err) => {

        if(err){
        
            throw new Error(err);
        
        }else{
        
            console.log('projects Saved on JSON File');
        
        }

    }); 

    await select.insertBatchProjects(projectsDetails);

    console.log('projects: ' + projectsDetails.length);
    
    return projectsDetails;

};

async function works(){

    var initPage = 1;
    var data = {};
    var worksList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','time_entries','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                worksList.push(data);
                initPage++;

                };

        } while (data.length > 0);

        worksList = worksList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/works.json`,JSON.stringify(worksList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('works Saved on JSON File');
            
            }

        }); 

        await select.insertBatchWorks(worksList);

        console.log('works: ' + worksList.length);
    
        return worksList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function invoices() {

    const invoiceList = await invoicesList();
    const headers = auxiliar.header('v3');
    let invoicesDetails = [];
    let invoicesWorks = [];
  
    await Promise.all(invoiceList.map(async (record) => {

        try {

            await limitarPeticiones();
    
            //get invoices detail
            const detailUrl = auxiliar.endPoints('v3','invoices/' + record.id);
            const detailRes = await axios.get(detailUrl, { headers });

            if (detailRes) {

                invoicesDetails.push(detailRes.data);
    
            };

            let initPage = 1;       // ← Ahora cada factura tiene su propio initPage
            let data     = [];

            //get works detail

            do {
        
                await limitarPeticiones();

                const worksUrl = `https://${process.env.SUBDOMAIN}.timebillingapp.com/api/v3/invoices/${record.id}/time_entries?page=${initPage}&per_page=${pageRecords};` // Su estructura es distinta por eso no se usa el estandar
                const worksRes = await axios.get(worksUrl, { headers });

                if (worksRes) {

                    data = worksRes.data;
                    const newElements = data.map(item => ({
                    invoiceId: record.id,
                    ...item
                
                }));

                invoicesWorks.push(...newElements);
                console.log(record.id + ' page: ' + initPage + ' completed');
                initPage++
    
                };

            } while (data.length > 0);

            console.log(record.id + ' completed ');

        } catch (error) {

          console.error(error);

        }

      })

    );
  
    invoicesDetails = invoicesDetails.flat();
    invoicesWorks = invoicesWorks.flat();

    // Save json File

    fs.writeFile(`./jsonFiles/invoices.json`,JSON.stringify(invoicesDetails),(err) => {

        if(err){
        
            throw new Error(err);
        
        }else{
        
            console.log('invoices Saved on JSON File');
        
        }

    }); 

    
    fs.writeFile(`./jsonFiles/invoicesWorks.json`,JSON.stringify(invoicesWorks),(err) => {

        if(err){
        
            throw new Error(err);
        
        }else{
        
            console.log('invoicesWorks Saved on JSON File');
        
        }

    }); 

    await select.insertBatchInvoices(invoicesDetails);
    await select.insertBatchInvoicesWorks(invoicesWorks);

    console.log('invoices: ' + invoicesDetails.length);
    
    return invoicesDetails;

};

async function billingDocuments() {
 
    const billingList   = await billingsDocumentsList();
    const headers       = auxiliar.header('v3');
    const billingDetails = [];
    const billingErrors  = [];

    // hasta 3 intentos
    const promises = billingList.map(async (record) => {

        let attempt = 0;
    
        while (attempt < 3) {
      
            try {
                    attempt++;
                    await limitarPeticiones();
                    const url = auxiliar.endPoints('v3', `billing_documents/${record.id}`);
                    const res = await axios.get(url, { headers });

                    billingDetails.push(res.data);
                    console.log(`${record.id} completed (attempt ${attempt})`);
                    return;
        
            } catch (error) {
                    
                    console.error(`Error at ${record.id} (attempt ${attempt}):`, error.message);
            
                    if (attempt >= 3) {
            
                        billingErrors.push({ id: record.id, message: error.message });

                    }
            
            }
        }
  
    });

    await Promise.all(promises);

    fs.writeFile(`./jsonFiles/billings.json`, JSON.stringify(billingDetails, null, 2),
        (err) => {
        if (err) throw err;
        console.log('billings Saved on JSON File');
        }
    );

    if (billingErrors.length > 0) {fs.writeFile(`./jsonFiles/billingsErrors.json`,
        JSON.stringify(billingErrors, null, 2),
        (err) => {
            if (err) throw err;
            console.log('billings errors Saved on JSON File');
        }
        );
    };

    await select.insertBatchBillings(billingDetails);
    console.log(`Billings processed: ${billingDetails.length} of ${billingList.length}`);;

    return billingDetails;

};

async function payments() {

    var initPage = 1;
    var data = {};
    var paymentList = [];

    const headers = auxiliar.header('v3');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v3','payments','page=' + initPage + '&per_page=' + pageRecords);
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data;
                paymentList.push(data);
                console.log('page: ' + initPage + ' prosseced');
                initPage++;

                };

        } while (data.length > 0);

        paymentList = paymentList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/payments.json`,JSON.stringify(paymentList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('payments Saved on JSON File');
            
            }

        }); 

        await select.insertBatchPayments(paymentList);

        console.log('payments: ' + paymentList.length);
    
        return paymentList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function archived() {

    var initPage = 1;
    var data = {};
    var archivedList = [];

    const headers = auxiliar.header('v2-lemonsuite');
    
    try{

        do {
        
            await limitarPeticiones();

            var url = auxiliar.endPoints('v2-lemonsuite','invoices','page_size=' + pageRecords + '&current_page=' + initPage + '&archived=1');
            var res = await axios.get(url,{headers: headers});

            if(res){

                data = res.data.results;
                archivedList.push(data);
                console.log('page: ' + initPage + ' prosseced');
                initPage++;

                };

        } while (data.length > 0);

        archivedList = archivedList.flat();

        // Save json File

        fs.writeFile(`./jsonFiles/archived.json`,JSON.stringify(archivedList),(err) => {

            if(err){
            
                throw new Error(err);
            
            }else{
            
                console.log('archived Saved on JSON File');
            
            }

        }); 

        await select.insertBatchArchived(archivedList);

        console.log('archived: ' + archivedList.length);
    
        return archivedList;

    } catch(error){
        console.error(error)
        return 'error'
        
    };

};

async function currenciesRates(year = new Date().getFullYear()) {
  
    const tipos = ['uf', 'dolar', 'utm','euro'];

  try {

        // Disparar todas las peticiones en paralelo

        const resultados = await Promise.all(

            tipos.map(async tipo => {

                const url = auxiliar.cmfUrl(tipo, year);

                const res = await axios.get(url);

                console.log(`${tipo}: processed for year ${year}`);

                return res.data;

            })

        );

        const currenciesValues = resultados.flat();

        await fs.promises.writeFile('./jsonFiles/currenciesRates.json',JSON.stringify(currenciesValues, null, 2));

        console.log('currenciesRates guardado en JSON File');

        await select.insertBatchCurrenciesRates(currenciesValues);

        console.log('payments: ' + currenciesValues.length);

        return currenciesValues;

    } catch (error) {

        console.error(error);

        return 'error';

    }

};

module.exports = {
    holdings,
    clients,
    clientsEntitiesAndContacs,
    rates,
    ratesValues,
    areas,
    categories,
    usersCategories,
    usersTeams,
    users,
    currencies,
    banksAccounts,
    projects,
    works,
    invoices,
    billingDocuments,
    payments,
    archived,
    currenciesRates,
    invoicesList, //temporal
};

