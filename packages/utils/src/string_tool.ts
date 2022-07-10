export function str_to_b64(str:string):string{
  return btoa(encodeURIComponent(str));
}

export function b64_to_str(b64:string):string{
  return decodeURIComponent(atob(b64));
}