const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("resources"));
app.set("view engine", "ejs");

// mongoose.connect("mongodb://localhost:27017/listDB", (e)=>{
//     if (e!=null){
//         console.log("Failed to connect to MongoDB database. Exiting application");
//         process.exit();
//     }
//     else{
//         console.log("Connected to MongoDB database successfully");
//     }
// });

mongoose.connect("mongodb+srv://db-user:password0@cluster0.9sys7.mongodb.net/listDB");

const worklistSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    }
});

const playlistSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    }
});

const booklistSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    }
});

const Worklist = mongoose.model("Worklist", worklistSchema);
const Playlist = mongoose.model("Playlist", playlistSchema);
const Booklist = mongoose.model("Booklist", booklistSchema);

let worklistArr=[];
let playlistArr=[];
let booklistArr=[];

app.listen(PORT, ()=>{
    console.log("Server started at ["+PORT+"]");
});

app.get("/", (req, res)=>{

    let filter={};
    let projection={};

    Worklist.find(filter, projection, (e, docs)=>{
        if (e!=null){
            console.log("Error in fetching from database. Rendering empty array");
        }
        else{
            worklistArr=[];
            docs.forEach((element) => {
                worklistArr.push(element);
            });
        }
        res.render("list",{listTitle:"Worklist", newListItems:worklistArr});
    });
    
});

app.get("/:listname", (req, res)=>{

    let listname = _.toLower(req.params.listname);

    let filter = {};
    let projection = {};

    if (listname==="book"){
        Booklist.find(filter, projection, (e, docs)=>{
            if (e!=null){
                console.log("Error in fetching from database. Rendering empty array");
            }
            else{
                booklistArr=[];
                docs.forEach((element)=>{
                    booklistArr.push(element);
                });
            }
            res.render("list", {listTitle:"Booklist", newListItems: booklistArr});
        });
    } else if (listname==="play"){
        Playlist.find(filter, projection, (e, docs)=>{
            if (e!=null){
                console.log("Error in fetching from database. Rendering empty array");
            }
            else{
                playlistArr=[];
                docs.forEach((element)=>{
                    playlistArr.push(element);
                });
            }
            res.render("list", {listTitle:"Playlist", newListItems: playlistArr});
        });
    }

});


app.post("/", (req, res)=>{

    if (req.body.addItem === "Worklist"){

        let worklist = new Worklist({name:req.body.newItem});
        worklist.save();
        
        res.redirect("/");
    }
    else if (req.body.addItem === "Booklist"){
        let booklist = new Booklist({
            name:req.body.newItem
        });
        booklist.save();
        res.redirect("/book");
    }
    else if (req.body.addItem === "Playlist"){

        let playlist = new Playlist({
            name:req.body.newItem
        });
        playlist.save();
        res.redirect("/play");
    }
    
});

app.post("/delete", (req, res)=>{

    let listName = req.body.hdntxt;
    let filter={
        _id:req.body.chkbx
    };

    if (listName==="Worklist"){
        Worklist.deleteOne(filter, (e, count)=>{
            if (e!=null){
                console.log("Error in deleting record");
            }else{
                res.redirect("/");
            }
        });

    }else if (listName==="Booklist"){
        Booklist.deleteOne(filter, (e, count)=>{
            if (e!=null){
                console.log("Error in deleting record");
            }else{
                res.redirect("/book");
            }
        });
    }else if (listName==="Playlist"){
        Playlist.deleteOne(filter, (e, count)=>{
            if (e!=null){
                console.log("Error in deleting record");
            }else{
                res.redirect("/play");
            }
        });
    }else{
        console.log("Invalid list name");
    }

});