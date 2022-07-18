const express = require('express');
const  bodyParser = require('body-parser')

const validator = require('./Validator')
const cors = require('cors')
const fs = require('fs');


const app = express();
const port = 3000

// 27/100* principal

const calculatePercentage = (percentage, principal) => {
    
   return percentage/100*principal
}

const value =calculatePercentage(44, 4000)
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let formattedRequest =[]
app.post('/split-payments/compute', validator.createValidationFor('createUser'), validator.checkValidationResult, async(req, res) => {
   let balance = Number(req.body.Amount);
   const {SplitInfo} = req.body;
    SplitInfo.forEach( (info) => {
        if(info.SplitType === 'FLAT'){
            const percentage =  calculatePercentage(info.SplitValue, balance)
            info.amount = percentage
            balance = percentage
        }
        if(info.SplitType === 'PERCENTAGE'){
            const percentage =  calculatePercentage(info.SplitValue, balance)
            info.amount = percentage
            balance = percentage
        }
        if(info.SplitType === 'RATIO'){
            const percentage =  calculatePercentage(info.SplitValue, balance)
            info.amount = percentage
            balance = percentage
        }
    })
    SplitInfo.filter((x => {
        formattedRequest.push({
            amount : x.amount,
            SplitEntityId: x.SplitEntityId,
        })
    }))

    const data = {balance, SplitBreakdown:formattedRequest,  id:  Math.floor(Math.random()* 100) + 1}

    fs.appendFileSync('data.json', JSON.stringify({...req.body, id: data.id}), (err) => {
        if(err){
            // res.status(500).send({error: 'An error occurred'})
            }
       })

   res.status(201).send({message: 'Successfully created', data})
})

app.listen(port, () => console.log('running on port' + port))