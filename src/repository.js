import axios from "axios";


const repository = {
    _nextId: () => {
        // const data = window.localStorage.getItem('data');
        // //database lo unna anni id's nunchi max id tisku ravali.... 
        // //that can be done here or can be domne fomr databse also..
        
        // if (!data) {
        //     return 1;
        // }

        // const list = JSON.parse(data);
        // const maxId = Math.max(...list.map(x => x.id));
        // return maxId + 1;
        var vnextid = 0;
        axios.get("http://localhost:8080/getNextNode")
        .then(response => {
            vnextid=response.data;
            console.log(vnextid);
        })
        .catch(error => {
            console.log(error);
        })
        return 0;


    },
    add: (item) => {

        item.id = repository._nextId();//next id techukovali ..
        //ah techukunna id ni epudu manam create chese element ki id laga use cheskovali..
        
         item.rootId = item.rootId || item.id;
        // //present create chese element ki root id kanuknnadu..

        // const data = window.localStorage.getItem('data');
        // //local storage lo unna data aneh name tho unna list ni techukunnam..

        // console.log(data);
        // console.log("**************");
        // const list = data ? JSON.parse(data) : [];
        // //list ni json formatt laga change chesam

        // list.push(item);
        // //kotha element ni list loki push chesam..

        // window.localStorage.setItem('data', JSON.stringify(list));
        // //malla same adhe name i.e data aneh name tho local storage lo save cheskunnam..
        axios.post("http://localhost:8080/nodes",item)
        .then(response => {
            console.log("Success");
            console.log(response);
        })
        .catch(error => {
            console.log("failure");
            console.log(error);
        });
        
        return item;

    },
    delete: (id) => {
        const data = window.localStorage.getItem('data');
        //data aneh local storage lo save ayyi unna list ni tecukuni..
        //ah element ni and dhaniki associate ayyi unna elements annitini delete chesesthunam..
        const list = JSON.parse(data);
        repository._setDeleted(id, list);
        //e logic antha ardam cheskuni manam mana spring server lo rayali..
        // for (let i = 0; i < list.length;) {
        //     if (list[i].deleted) {
        //         list.splice(i, 1);
        //     } else {
        //         i++;
        //     }
        // }
        window.localStorage.setItem('data', JSON.stringify(list));
    },
    _setDeleted: (id, list) => {
        list.forEach(x => {
            if (x.id === id) {
                x.deleted = true;
            }
            if (x.parentId === id) {
                repository._setDeleted(x.id, list);
            }
            console.log(list);
        });
    },
    update: (id, item) => {
        //var data = window.localStorage.getItem('data');
       
        //item.push(id);
        item['id']=id;
        console.log(item);
        // //console.log(item);
        // const list = JSON.parse(data);
        // const currentItem = list.find(x => x.id === id);
        // Object.entries(item).forEach(([key, value]) => {
        //     currentItem[key] = value;
        // });
        // //console.log(currentItem);
        // window.localStorage.setItem('data', JSON.stringify(list));
        axios.put("http://localhost:8080/updateNodeData",item)
        .then(response => {
            console.log("Success..");
            console.log(response);
        })
        .catch(error =>{
            console.log("Failure due to error");
            console.log(error);
        });
        return item;
    },

    
    save: (item) => {
        if (item.id) {
            return repository.update(item.id, item);
        }
        return repository.add(item);
    },
    getList: (filter) => {
        const [key, value] = Object.entries(filter)[0];
        const data = window.localStorage.getItem('data');
        if (!data) {
            return [];
        }
        const list = JSON.parse(data);
        const result = list.filter(x => x[key] === value);
        return result;
    },
    getItem: (id) => {
        const data = window.localStorage.getItem('data');
        if (!data) {
            return null;
        }
        const list = JSON.parse(data);
        return list.find(x => x.id === id);
    }
};

export default repository;
