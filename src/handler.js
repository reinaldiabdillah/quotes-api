const { nanoid } = require('nanoid');
const quotes = require('./quotes');

const addQuoteHandler = (request, h) => {
    const { quote, author } = JSON.parse(request.payload);

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newQuote = {
        id,
        quote,
        author,
        createdAt,
        updatedAt,
    };
    quotes.push(newQuote);

    const isSuccess = quotes.filter((quote) => quote.id === id).length > 0;
    if (isSuccess) {
        const resp = h.response({
            status: 'success',
            message: 'Kutipan berhasil ditambahkan',
            data: {
                quoteId: id,
            },
        });
        resp.code(201);
        return resp;
    }

    const resp = h.response({
        status: 'fail',
        message: 'Kutipan gagal ditambahkan',
    });
    resp.code(500);
    return resp;
};

const getAllQuotesHandler = () => ({
    status: 'success',
    data: {
        quotes,
    },
});

const getQuoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const quote = quotes.filter((q) => q.id === id)[0];

    if (quote !== undefined) {
        return {
            status: 'success',
            data: {
                quote,
            },
        };
    }
    const resp = h.response({
        status: 'fail',
        message: 'Kutipan tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const editQuoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { quote, author } = JSON.parse(request.payload);
    const updatedAt = new Date().toISOString();

    const index = quotes.findIndex((q) => q.id === id);
    if (index !== -1) {
        quotes[index] = {
            ...quotes[index],
            quote,
            author,
            updatedAt,
        };
        const resp = h.response({
            status: 'success',
            message: 'Kutipan berhasil diperbarui',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Gagal memperbarui kutipan. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const deleteQuoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = quotes.findIndex((q) => q.id === id);

    if (index !== -1) {
        quotes.splice(index, 1);
        const resp = h.response({
            status: 'success',
            message: 'Kutipan berhasil dihapus',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Kutipan gagal dihapus. Id tidak ditemukan.',
    });
    resp.code(404);
    return resp;
};

module.exports = {
    addQuoteHandler,
    getAllQuotesHandler,
    getQuoteByIdHandler,
    editQuoteByIdHandler,
    deleteQuoteByIdHandler,
};
