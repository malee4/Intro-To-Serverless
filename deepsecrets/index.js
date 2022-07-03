const qs = require('qs');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    const queryObject = qs.parse(req.body);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: queryObject.Body
    };
}