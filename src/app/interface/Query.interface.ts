
export interface  PrismaFindManyArgs{
    where?: Record<string, unknown>,
    include?: Record<string, unknown>,
    select?: Record<string, boolean | Record<string, unknown>>,
    orderBy?: Record<string, unknown | Record<string, unknown>>[],
    skip?: number,
    take?: number,
    cursor?: Record<string, unknown>,
    distinct?: string[] | string,
    [key: string]: unknown
}

export interface PrismaCountArgs{

 where?: Record<string, unknown>,
    include?: Record<string, unknown>,
    select?: Record<string, boolean | Record<string, unknown>>,
    orderBy?: Record<string, unknown | Record<string, unknown>>[],
    skip?: number,
    take?: number,
    cursor?: Record<string, unknown>,
    distinct?: string[] | string,
    [key: string]: unknown
}

export interface PrismaModeDelegate{
    findMany(args?: PrismaFindManyArgs): Promise<Record<string, unknown>[]>;
    count(args?: PrismaCountArgs): Promise<number>;
   
}
export interface iQueryParams{
    serachterm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    include?: string;
   
    [key: string]: unknown;
}
export interface IQueryConfig{
    searchableFields: string[];
    filterableFields: string[];
}
export interface Prismastringtyes{
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    equals?: string;
    in?: string[];
    lte?: string;
    gte?: string;
    gt?: string;
    lt?: string;
    not?: string | Record<string, unknown>;
    mode?: 'insensitive' | 'default';
}

export interface PrismaWhereconditions {
    OR?: Record<string, unknown>[];
    AND?: Record<string, unknown>[];
    NOT?: Record<string, unknown> | Record<string, unknown>[];
    [key: string]: unknown;
}

export interface PrismeNumberFilter{
    equals?: number;
    in?: number[];
    lte?: number;
    gte?: number;
    gt?: number;
    lt?: number;
    not?: number | Record<string, unknown>;
}