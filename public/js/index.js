'use strict'
$(function(){
    //var host = '{{config.host}}';
    var socket = io.connect('http://localhost:3000');
    var articleNames = [];
    var links = [];

    //We have to find the index because the Wikipedia API the links of the articles in a random order
    function findIndex(name, arr){
      if(name.indexOf(' ')>0){
          name = name.substring(0, name.indexOf(' '));
      }
      for(var index =0; index < arr.length; index++){
          if(arr[index].indexOf(name)>0){
              return index;
          }
      }
      return -1;
    }

    socket.on('articleNames', function (data) {
      JSON.stringify(data);
      var articleData = '';
      for(var i =0; i<data.length; i++){
          if (data.charAt(i) !== '\n' && i === data.length -1){
                articleData += data.charAt(i);
                articleNames.push(articleData);
          }
          else if(data.charAt(i) !== '\n'){
                articleData += data.charAt(i);
            //console.log(linkData);
          } else {
              //console.log(linkData);
              articleNames.push(articleData);
              articleData = '';
          }
      }
      for(var i =0; i<articleNames.length; i++){
          console.log(articleNames[i]);
      }
    });

    socket.on('articleLinks', function (data) {
      JSON.stringify(data);
      var linkData = '';
      for(var i =0; i<data.length; i++){
          if (data.charAt(i) !== '\n' && i === data.length -1){
                linkData += data.charAt(i);
                links.push(linkData);
          }
          else if(data.charAt(i) !== '\n'){
                linkData += data.charAt(i);
            //console.log(linkData);
          } else {
              //console.log(linkData);
              links.push(linkData);
              linkData = '';
          }
      }

        for(var i =0; i<links.length; i++){
              console.log(links[i]);
        }

        for(var j =0; j<links.length; j++){
              console.log("Link: " + links[j] + " Article: " + articleNames[j]);
        }

      //Put this here because articleNames gets pushed first 
      var html = '';
      for(var j =0; j<links.length; j++){
          html += '<a href="'+links[findIndex(articleNames[j], links)]+'">'+articleNames[j]+'</a> <br>';
        $("#name").html(html);
      }

    });

});
