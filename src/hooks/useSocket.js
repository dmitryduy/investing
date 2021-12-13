import socket from "../sockets";

const useSocket = (msgName) => {

    return {
        on: (cb) => {
            socket.on(msgName, (data) => {
                cb(data);
            })
        },
        off: () => {
            socket.off(msgName)
        },
        emit: (data) => {
            console.log(data)
            socket.emit(msgName, data)
        }
    }
}

export default useSocket;