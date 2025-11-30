    const localdate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");      
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        const formattedWithTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedWithTime;
    }
    export default localdate;