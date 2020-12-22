export default async function authorize(
  _url: string,
  _username: string,
  _password: string,
) {
  console.log('not implemented. should not come here!');
  throw new Error(
    'automatic OAuth autorization on web browser is not implemented.',
  );
}
