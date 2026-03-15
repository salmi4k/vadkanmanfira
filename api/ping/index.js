module.exports = async function pingHandler(context) {
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ok: true,
      runtime: 'managed-api',
    }),
  };
};
