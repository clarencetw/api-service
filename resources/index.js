exports.handler = async function (event) {
    if (event.httpMethod === "GET") {
        if (event.path === "/") {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: `{"name":"Hello AWS CDK!"}`
            };
        }
    }

    return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(event), 
    }; 
};
