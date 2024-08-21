declare module 'shpjs' {
  function shp(url: string | ArrayBuffer): Promise<any>;
  export default shp;
}
