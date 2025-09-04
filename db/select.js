const connFunc = require("./conexion");
const fs = require("node:fs");

// Selects:

async function getClientsId() {

  const conn = await connFunc();
  const sql = `select * from clients`;
  var clientsId = [];

  const result = await conn.query(sql)

  for (client of result[0]){

    clientsId.push(client.clientId);
  
  };

  return clientsId;

};

async function getRatesId() {

  const conn = await connFunc();
  const sql = `select * from rates`;
  var ratesId = [];

  const result = await conn.query(sql)

  for (rate of result[0]){

    ratesId.push(rate.rateId);
  
  };

  return ratesId;

};


// Inserts:

async function insertBatchHoldings(json) {

  //insert config ----
   // const file = fs.readFileSync('./jsonFiles/holdings.json');
   // const json = JSON.parse(file);
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  };

  //Delete 
  await conn.query('delete from holdings');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = "insert into holdings (holdingId,name) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
    ]);

    await conn.query(sql, [values]);

    console.log('holdings saved on database');

  };

};

async function insertBatchClients(json) {

  //insert config ----
   // const file = fs.readFileSync('./jsonFiles/clients.json');
   // const json = JSON.parse(file);
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  };

  //Delete 
  await conn.query('delete from clients');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = "insert into clients (clientId,holdingId,code,name,active) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.holding ? record.holding.id : null,
      record.code,
      record.name,
      record.active ? 1 : 0
    ]);

    await conn.query(sql, [values]);

    console.log('clients saved on database');

  }

};

async function insertBatchClientsEntities(json) {

  //insert config ----
   // const file = fs.readFileSync('./jsonFiles/clientsEntities.json');
   // const json = JSON.parse(file);
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  };

  //Delete 
  await conn.query('delete from clientsEntities');

  //Insert

  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = "insert into clientsEntities(clientId,entityId,rut,name) values? ";
    const values = batch[i].map((record) => [
      record.client.id,
      record.id,
      record.tin,
      record.name
      ]);

    await conn.query(sql, [values]);

    console.log('clientsEntities saved on database');

  };

};

async function insertBatchClientsContacts(json) {

  //insert config ----
   // const file = fs.readFileSync('./jsonFiles/clientsContacs.json');
   // const json = JSON.parse(file);
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  };

  //Delete 
  await conn.query('delete from clientsContacts');

  //Insert

  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = "insert into clientsContacts(clientId,contactId,name,mail) values? ";
    const values = batch[i].map((record) => [
      record.client.id,
      record.id,
      record.name,
      record.email
      ]);

    await conn.query(sql, [values]);

    console.log('clientsContacts saved on database');

  };

};

async function insertBatchRates(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/rates.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete rates
  await conn.query('delete from rates');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into rates (rateId,description) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.description
    ]);

    await conn.query(sql, [values]);

    console.log('rates saved on database');

  }

};

async function insertBatchRatesByUser(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/ratesByUser.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from ratesByUser');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into ratesByUser (rateValueId,userId,rateId,currencyId,rate) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.user_id,
      record.fee_id,
      record.currency_id,
      record.rate
    ]);

    await conn.query(sql, [values]);

    console.log('rates by user saved on database');

  }

};

async function insertBatchRatesByCategory(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/ratesByUser.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }


  await conn.query('delete from ratesByCategory');


  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into ratesByCategory (rateValueId,categoryId,rateId,currencyId,rate) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.user_category_id,
      record.fee_id,
      record.currency_id,
      record.rate
    ]);

    await conn.query(sql, [values]);

    console.log('rates by category saved on database');

  }

};

async function insertBatchAreas(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/areas.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from areas');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into areas (areaId,name) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
    ]);

    await conn.query(sql, [values]);

    console.log('areas saved on database');

  }

};

async function insertBatchCategories(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/categories.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from categories');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into categories (categoryId,name) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
    ]);

    await conn.query(sql, [values]);

    console.log('categories saved on database');

  }

};

async function insertBatchUsersCategories(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/usersCategories.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from usersCategories');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into usersCategories (categoryId,name) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
    ]);

    await conn.query(sql, [values]);

    console.log('usersCategories saved on database');

  }

};

async function insertBatchUsersTeams(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/usersTeams.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from usersTeams');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into usersTeams (teamId,name) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
    ]);

    await conn.query(sql, [values]);

    console.log('usersTeams saved on database');

  }

};

async function insertBatchUsers(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/users.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from users');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into users (userId,name,rolId,categoryId,teamId,dailyWorksGoal,dailyBillingGoal,mail) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
      record.role.id,
      record.user_category.id,
      record.work_team ? record.work_team.id : null,
      record.worked_hours_daily_goal,
      record.daily_goal,
      record.email
    ]);

    await conn.query(sql, [values]);

    console.log('users saved on database');

  }

};

async function insertBatchCurrencies(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/currencies.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from currencies');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into currencies (currencyId,code,symbol) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.code,
      record.symbol
    ]);

    await conn.query(sql, [values]);

    console.log('currencies saved on database');

  }

};

async function insertBatchBanksAccounts(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/banksAccounts.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from banksAccounts');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into banksAccounts (bankAccountId,name,number,bankName) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.name,
      record.number,
      record.bank.name
    ]);

    await conn.query(sql, [values]);

    console.log('banksAccount saved on database');

  }

};

async function insertBatchProjects(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/projects.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from projects');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = `insert into projects (projectId, name, active, code, areaId, categoryId, clientId, commercialUserId, 
                 billingStrategy, strategyCode, rateCurrencyId, invoiceCurrencyId, billFeeId, billFlatRate, billRetainerAmmount, 
                 billRetainerCurrencyId, billRetainerHours, intervalPeriod, startDate, endDate, fromDate, capAmmount, capCurrencyId, 
                 legalEntityId, requesterId, bankAccountId, notes, description) values? `;
    const values = batch[i].map((record) => [
      record.id,
      record.name,
      record.active ? 1 : 0,
      record.code,
      record.project_area ? record.project_area.id : null,
      record.project_category ? record.project_category.id : null,
      record.client.id,
      record.commercial_agreement.bill_account_manager ? record.commercial_agreement.bill_account_manager.id : null,
      record.commercial_agreement.billing_strategy, 
      record.commercial_agreement.strategy_code, 
      record.commercial_agreement.rate_currency ? record.commercial_agreement.rate_currency.id : null,
      record.commercial_agreement.invoice_currency ? record.commercial_agreement.invoice_currency.id : null,
      record.commercial_agreement.bill_fee ? record.commercial_agreement.bill_fee.id : null,
      record.commercial_agreement.bill_flat_rate,
      record.commercial_agreement.bill_retainer_amount,
      record.commercial_agreement.bill_retainer_currency ? record.commercial_agreement.bill_retainer_currency.id : null,
      record.commercial_agreement.bill_retainer_hours,
      record.commercial_agreement.interval, 
      record.commercial_agreement.start_date,
      record.commercial_agreement.end_date,
      record.commercial_agreement.from_date,
      record.commercial_agreement.cap_amount,
      record.commercial_agreement.cap_currency ? record.commercial_agreement.cap_currency.id : null,
      record.commercial_agreement.legal_entity ? record.commercial_agreement.legal_entity.id : null, 
      record.commercial_agreement.requester ? record.commercial_agreement.requester.id : null,
      record.commercial_agreement.bank_account ? record.commercial_agreement.bank_account.id : null,
      record.commercial_agreement.notes,
      record.description

    ]);

    await conn.query(sql, [values]);

    console.log('projects saved on database');

  }

};

async function insertBatchWorks(json) {

  //insert config ----
    // const file = fs.readFileSync('./jsonFiles/works.json');
    // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from works');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);
    const sql = "insert into works (workId,projectId,date,duration,billableDuration,reviewed,billable,description,userId,reviewComment) values? ";
    const values = batch[i].map((record) => [
      record.id,
      record.project.id,
      record.date,
      record.duration,
      record.billable_duration,
      record.reviewed ? 1 : 0,
      record.billable ? 1 : 0,
      record.description,
      record.user.id,
      record.review_comment
    ]);

    await conn.query(sql, [values]);

    console.log('works saved on database');

  }

};

async function insertBatchInvoices(json) {

  //insert config ----
   // const file = fs.readFileSync('./jsonFiles/invoices.json');
   // const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from invoices');

  //Parse date function
  const parseIsoDate = (isoString) => {
    if (!isoString) return null;   // Convierte algo tipo "2025-04-07T15:51:20.000Z" en "2025-04-07 15:51:20"
    return isoString
      .replace('T', ' ')   // Reemplaza la 'T' por espacio
      .replace('.000Z', ''); // Quita la parte final de milisegundos y 'Z'
  };

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = `insert into invoices (invoiceId, clientsId, issuedDate, totalAmount, discountAmount, liquidationDate, draftDate, approvedDate, 
                 billedDate, finishedDate, invoiceDetailId, invoiceDetailAmount, invoiceDetailCurrencyId,invoiceCurrencyId,rateCurrencyId,billAccountManagerId,invoiceState) values? `;

    const values = batch[i].map((record) => {

    // Get differents states dates from invoice
    let movements = record.invoice_state_movements || [];

    const getLastMovement = (names) => {

    const movs = movements.filter(mov => names.includes(mov.state));
    
    if (!movs.length) return null;

      return movs.reduce((latest, mov) =>

        new Date(mov.date) > new Date(latest.date) ? mov : latest
        
      );

    };

    let draftMovement    = getLastMovement(['Draft',   'Borrador']);
    let approvedMovement = getLastMovement(['Approved','Aprobado']);
    let billedMovement   = getLastMovement(['Billed',  'Facturado']);
    let finishedMovement = getLastMovement(['Finished','Finalizado']);

    return [

      record.id,
      record.client.id,
      parseIsoDate(record.issued_at),
      record.total_amount,
      record.discount_amount,
      record.to_liquidation_date,
      parseIsoDate(draftMovement?.date),
      parseIsoDate(approvedMovement?.date),
      parseIsoDate(billedMovement?.date),
      parseIsoDate(finishedMovement?.date),
      record.invoice_details.length > 0 ? record.invoice_details[0].id : null,
      record.invoice_details.length > 0 ? record.invoice_details[0].total_amount : null,
      record.invoice_details.length > 0 ? record.invoice_details[0].currency.id : null,
      record.agreement.rate_currency.id ? record.agreement.rate_currency.id : null,
      record.agreement.invoice_currency.id ? record.agreement.invoice_currency.id : null,
      record.agreement.bill_account_manager ? record.agreement.bill_account_manager.id : null,
      record.state
    ];

  });

    await conn.query(sql, [values]);

  }

  console.log('invoices saved on database');

};

async function insertBatchInvoicesWorks(json) {

  //insert config ----
    //const file = fs.readFileSync('./jsonFiles/invoicesWorks.json');
    //const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from invoicesWorks');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sql = `insert into invoicesWorks (invoiceId, workId) values? `;

    const values = batch[i].map((record) => {

    return [

      record.invoiceId,
      record.id,
 
    ];

  });

    await conn.query(sql, [values]);

  }

  console.log('invoicesWorks saved on database');

};

async function insertBatchBillings(json) {

  //insert config ----
    //const file = fs.readFileSync('./jsonFiles/billings.json');
    //const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from billings');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sqlBillings = `insert into billings (billingId, number, issueDate, subTotal, taxes, total, balance, billingState, billingEntityId, billingCurrencyId,invoiceId, documentType ) values? `;

    const valuesBillings = batch[i].map((record) => [
      record.id,
      record.number,
      record.issue_date,
      record.subtotal,
      record.taxes,
      record.total,
      record.balance,
      record.billing_document_state,
      record.billing_entity ? record.billing_entity.id : null,
      record.currency ? record.currency.id : null,
      record.invoices ? record.invoices[0].id : null,
      record.billing_document_type ? record.billing_document_type.name : null
    
    ]
     
  );

    await conn.query(sqlBillings, [valuesBillings]);

  }

  console.log('billings saved on database');

};

async function insertBatchPayments(json) {

  //insert config ----
  //  const file = fs.readFileSync('./jsonFiles/payments.json');
  //  const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from payments');
  await conn.query('delete from billingsPayments');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sqlPayments = `insert into payments (paymentId, date, clientId, total, balance) values? `;
    const sqlBillingPayments =  `insert into billingsPayments (paymentId, billingId) values ?`;

    const valuesPayments = [];
    const valuesBillingPayments = [];

    batch[i].forEach((record) => {
      
      valuesPayments.push([
        record.id,
        record.date,
        record.client ? record.client.id : null,
        record.total,
        record.balance
      ]);

      if (Array.isArray(record.billing_documents)) {

        record.billing_documents.forEach((doc) => {
        
          valuesBillingPayments.push([record.id, doc.id]);
        
        });
      }

    });
     

    await conn.query(sqlPayments, [valuesPayments]);

    if (valuesBillingPayments.length) {
    
      await conn.query(sqlBillingPayments, [valuesBillingPayments]);
    
    }
  
  };

  console.log('payments saved on database');

};

async function insertBatchArchived(json) {

  //insert config ----
  //  const file = fs.readFileSync('./jsonFiles/archived.json');
  //  const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------

  const batch = [];

  for (let i = 0; i < json.length; i += batchSize) {
    batch.push(json.slice(i, i + batchSize));
  }

  //Delete 
  await conn.query('delete from invoicesArchived');

  //Insert
  for (let i = 0; i < batch.length; i++) {
    
    console.log(`Inserting batch ${i + 1} of ${batch.length}`);

    const sqlArchived = `insert into invoicesArchived (invoiceId) values? `;

    const valuesArchived = [];

    batch[i].forEach((record) => {
      
      valuesArchived.push([
        record.id
      ]);

    });
     
    await conn.query(sqlArchived, [valuesArchived]);
 
  };

  console.log('archived saved on database');

};

async function insertBatchCurrenciesRates() {

  //insert config ----
    const file = fs.readFileSync('./jsonFiles/currenciesRates.json');
    const json = JSON.parse(file);  
    const batchSize = 500;
    const conn = await connFunc();
  //-------------------


  // Mapeo entre las keys del JSON y el código en la BD
  const codeMap = {
    'UFs':    'CLF',
    'Dolares':'USD',
    'UTMs':   'UTM',
    'Euros':  'EUR'
  };

  for (const currencyObj of json) {
    
    // Cada objeto del array tiene una sola propiedad: "UFs", "Dolares" o "UTMs"
    const currencyKey = Object.keys(currencyObj)[0];
    const records     = currencyObj[currencyKey];
    const code        = codeMap[currencyKey];
    if (!code || !records.length) continue;

    // Determinar año a partir de la primera fecha
    const year = parseInt(records[0].Fecha.slice(0, 4), 10);

    console.log(code + ' - ' + year)

    // Eliminar registros existentes para este código y año
    await conn.query(`delete from currenciesRates where code = ? and year(date) = ? and origin = 'API'`, [code, year]);

    // Dividir en lotes de hasta batchSize registros
    for (let i = 0; i < records.length; i += batchSize) {

      const batch = records.slice(i, i + batchSize);
      const values = batch.map(rec => {
   
        // Convertir "35.122,26" -> "35122.26"
        const numericStr = rec.Valor.replace(/\./g, '').replace(',', '.');
   
        return [
          code,
          rec.Fecha, 
          parseFloat(numericStr)
        ];
   
      });

      console.log(
   
        `Insertando batch ${Math.floor(i / batchSize) + 1} de ${Math.ceil(records.length / batchSize)} para ${code}`
   
      );
   
      await conn.query('insert into currenciesRates (code, date, value) values ?', [values]);
    }

    console.log(`Datos de ${code} para ${year} guardados.`);

  }

  console.log('currenciesRates guardados en la base de datos');
}

async function insertBiWorks() {

  const conn = await connFunc();

  //Delete 
  await conn.query('delete from biWorks');

  //Insert
   
  console.log(`Inserting biWorks`);

  const sql = `insert into biWorks 
                SELECT 
                year(wk.date) as ano,
                month(wk.date) as mes,
                hl.name as holding,
                cl.name as clientName,
                cl.active as clientState,
                en.rut as entityRut,
                en.name as entityName,
                co.name as contactName,
                ar.name as area,
                ct.name as category,
                uscm.name as commercialUser,
                pr.code as projectCode,
                pr.name as projetName,
                pr.active as projectState,
                pr.billingStrategy,
                rt.description as rateName,
                rtus.rate,
                rtcr.symbol as rateCurrency,
                pr.billFlatRate,
                pr.billRetainerAmmount,
                rncr.symbol as retairnerCurrency,
                pr.billRetainerHours,
                pr.intervalPeriod,
                pr.capAmmount,
                cpcr.symbol as capCurrency,
                pr.notes as projectNotes,
                pr.description as projectDescrption,
                wk.date as workDate,
                uswktm.name as workUserTeam,
                uswkct.name as workUserCategry,
                uswk.name as workUser,
                wk.description as workDesription,
                wk.duration as workDuration,
                wk.billableDuration,
                wk.billable,
                wk.reviewed,
                wk.reviewComment,
                inv.invoiceId,
                inv.liquidationDate,
                inv.totalAmount as invoiceAmount,
                incr.symbol as invoiceCurrency,
                getInvoiceState(inv.invoiceId) as invoiceState,
                pay.billCount as billsQuantiy,
                pay.currency as billCurrency,
                pay.billAmount,
                pay.payAmount
                FROM 
                works as wk
                left join projects as pr on wk.projectId = pr.projectId
                left join clients as cl on pr.clientId = cl.clientId
                left join holdings as hl on cl.holdingId = hl.holdingId
                left join areas as ar on pr.areaId = ar.areaId
                left join categories as ct on pr.categoryId = ct.categoryId
                left join users as uscm on pr.commercialUserId = uscm.userId
                left join users as uswk on wk.userId = uswk.userId
                left join usersCategories as uswkct on uswk.categoryId = uswkct.categoryId
                left join usersTeams as uswktm on uswk.teamId = uswktm.teamId
                left join clientsEntities as en on pr.legalEntityId = en.entityId
                left join clientsContacts as co on pr.requesterId = co.contactId
                left join banksAccounts as bk on pr.bankAccountId = bk.bankAccountId
                left join rates as rt on pr.billFeeId = rt.rateId
                left join currencies as rtcr on pr.rateCurrencyId = rtcr.currencyId
                left join currencies as rncr on pr.billRetainerCurrencyId = rncr.currencyId
                left join currencies as cpcr on pr.capCurrencyId = cpcr.currencyId
                left join ratesByUser as rtus on uswk.userId = rtus.userId and pr.billFeeId = rtus.rateId and pr.rateCurrencyId = rtus.currencyId
                left join invoicesWorks as inwk on wk.workId = inwk.workId
                left join invoices as inv on inwk.invoiceId = inv.invoiceId
                left join currencies as incr on inv.rateCurrencyId = incr.currencyId
                left join invoicePayments as pay on inv.invoiceId = pay.invoiceId
                order by workDate
                ;`;

    await conn.query(sql);

  console.log('biWorks saved on database');

};

module.exports = {
  getClientsId,
  getRatesId,
  insertBatchHoldings,
  insertBatchClients,
  insertBatchClientsEntities,
  insertBatchClientsContacts,
  insertBatchRates,
  insertBatchRatesByUser,
  insertBatchRatesByCategory,
  insertBatchAreas,
  insertBatchCategories,
  insertBatchUsersCategories,
  insertBatchUsersTeams,
  insertBatchUsers,
  insertBatchCurrencies,
  insertBatchBanksAccounts,
  insertBatchProjects,
  insertBatchWorks,
  insertBatchInvoices,
  insertBatchInvoicesWorks,
  insertBatchBillings,
  insertBatchPayments,
  insertBatchArchived,
  insertBatchCurrenciesRates,
  insertBiWorks,
};
