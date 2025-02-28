import express, { Request, Response } from "express";
import cors from "cors";
import getRandomSumbool from "./components/randomF";

const app = express();
app.use(express.json());
let counterPick = 0;
let alth = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a'];
//let alth =['q','w','e','r','t','y','u','i','o','p','a'
//    ,'s','d','f','g','h','j','k','l','z','x','c','v','b','n','m']; 25

interface itemForList {
    orderNumber: number,
    value: string,
    value2: string,
    selected: boolean
}
let listItems: Array<itemForList> = [];
let searchlistItems: Array<itemForList> = [];

let timeGen = setInterval(() => {
    if (listItems.length >= 1000000) {
        clearInterval(timeGen);
        return;
    }

    let genArr = Array.from({ length: 3000 }, (v, index) => ({
        orderNumber: index + 1 + counterPick,
        value: 'Запись' + (index + 1 + counterPick),
        value2: Array.from({ length: 7 }, () => { return alth[getRandomSumbool(11)] }).join(''),
        selected: false
    }));
    listItems = [...listItems, ...genArr];
    counterPick = listItems.length;
}, 900);


app.use(cors());

app.post('/', (req: Request, res: Response) => {
    let reqBoM = req.body.message;
    let messageTurn = req.body.messageTurn != '' ? searchlistItems : listItems;
    if (req.body.messageShow) {
        messageTurn = messageTurn.filter((elem: any) => elem.isChecked);
    }
    let needData = messageTurn.slice(reqBoM, reqBoM + 20)
    res.status(200).send(JSON.stringify({ mess: needData, mess1: messageTurn.length }));
});

app.post('/search', (req: Request, res: Response) => {
    let reqBoM = req.body.message;
    if (req.body.messageNumbORStr) {
        searchlistItems = listItems.filter((elem: any) => {
            return (elem.value2.toString()).toLowerCase().includes(reqBoM)
                && (req.body.messageShow ? elem.selected === true : true)
        });
    } else {
       // const foundItem = listItems.find((elem: any) => {
       //     return (elem.orderNumber.toString()).includes(reqBoM)
       // });
       // searchlistItems = foundItem ? [foundItem] : [];
       searchlistItems = listItems.filter((elem: any) => {
             return (elem.orderNumber.toString()).includes(reqBoM)
         });
    }
    //console.log(searchlistItems.length)
    let needData = searchlistItems.slice(0, 20);
    res.status(200).send(JSON.stringify(needData));
});

app.post('/updateCheckbox', (req: Request, res: Response) => {
    let reqBoM = req.body.message;
    let updateCheck = listItems.find((elem: itemForList) => elem.orderNumber === reqBoM);
    // console.log(updateCheck,reqBoM);
    if (updateCheck) {
        updateCheck.selected = !updateCheck.selected;
        res.status(200).send({ success: true });
    } else {
        res.status(400).send({ success: false, error: "чекбокс не менялся" });
    }
});

app.post('/update-order', (req: Request, res: Response) => {
    const reqBoM = req.body.message;
    let indexA = listItems.findIndex(item => item.orderNumber === reqBoM.activeId);
    let indexB = listItems.findIndex(item => item.orderNumber === reqBoM.overId);

    if (indexA === -1 || indexB === -1) {
        res.status(400).send({ success: false });
    } else {
        [listItems[indexA], listItems[indexB]] = [listItems[indexB], listItems[indexA]];

        res.status(200).send({ success: true });
    }
});

app.listen(801, '103.137.251.210', () => {
    console.log("Сервер запущен на порту 801");
});

