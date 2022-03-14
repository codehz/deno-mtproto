type DCType = "media" | "cdn" | "main";
type DCTarget = "test" | "prod";

type DCPrefix = `${DCType}-${DCTarget}`;

export type DCIdentifier<T extends DCPrefix = DCPrefix> = `${T}-${number}`;

export type DCInfo = {
  type: DCType;
  test: boolean;
  id: number;
};

export function toDCInfo(identifier: DCIdentifier): DCInfo {
  const [type, test, idstr] = identifier.split("-");
  return {
    type: type as DCType,
    test: test == "test",
    id: +idstr,
  };
}

export function toDCIdentifier(info: DCInfo): DCIdentifier {
  return `${info.type}-${info.test ? "test" : "prod"}-${info.id}`;
}
