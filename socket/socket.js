module.exports = function(io, data){
    socket.emit('dataUpdate', data);
}