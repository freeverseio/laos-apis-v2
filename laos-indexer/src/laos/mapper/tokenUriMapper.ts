import { BaseTokenUri, RawEvent, TokenUriFetchState } from "../../model";
import { getGenericTokenUriModel } from "../factory";



export function mapEventWithExternalURIToTokenUri(raw: RawEvent): BaseTokenUri {
  const TokenUri = getGenericTokenUriModel<BaseTokenUri>(process.env.TOKEN_URI_MODEL!);
  const tokenUri = new TokenUri({
    id: raw._tokenURI,
    state: TokenUriFetchState.Pending,
  });
  return tokenUri;
}

export function createTokenUriModels(rawEvents: RawEvent[]): BaseTokenUri[] {
  const tokenUris = rawEvents.map((raw) => mapEventWithExternalURIToTokenUri(raw));
  // remove duplicated ids
  return tokenUris.filter((tokenUri, index, self) =>
    index === self.findIndex(t => t.id === tokenUri.id)
  );
}
