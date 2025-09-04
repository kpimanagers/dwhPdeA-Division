const endPoints = require('./src/endPoints');

const select = require ('./db/select');
const cron = require('node-cron');

//cron.schedule('0 23 * * *',()=>{

    (async()=>{

        const startTime = new Date();

        await endPoints.holdings();
        await endPoints.clients();
        await endPoints.clientsEntitiesAndContacs();
        await endPoints.rates();
        await endPoints.ratesValues();
        await endPoints.areas();
        await endPoints.categories();
        await endPoints.usersCategories();
        await endPoints.usersTeams();
        await endPoints.users();
        await endPoints.currencies();
        await endPoints.banksAccounts();
        await endPoints.projects();
        await endPoints.works();
        await endPoints.invoices();
        await endPoints.billingDocuments();
        await endPoints.payments();
        await endPoints.archived();
        await endPoints.currenciesRates();
        await select.insertBiWorks();

         // Calcular tiempo total
        const endTime = new Date();
        const diffMs = endTime - startTime; // Diferencia en milisegundos

        // Convertir a HH:MM:SS
        const seconds = Math.floor(diffMs / 1000) % 60;
        const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        // Formatear con dos dígitos
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        console.log(`Duración total del proceso: ${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

 
    })();

//});


