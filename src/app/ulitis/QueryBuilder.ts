
import { object } from "zod/v4";
import {
  IQueryConfig,
  iQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModeDelegate,
  Prismastringtyes,
  
  PrismaWhereconditions,
  PrismeNumberFilter,
} from "../interface/Query.interface";
 

export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private conuntQuery: PrismaCountArgs;
  private orderBy: Record<string, unknown>[] = [];
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean | Record<string, unknown>> = {};

  constructor(
    private model: PrismaModeDelegate,
    private queryParams: iQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: [],
      skip: 0,
      take: 10,
      distinct: [],
      select: {},
    };
    this.conuntQuery = {
      where: {},
      include: {},
    };
  }
  search() : this {
    const { serachterm } = this.queryParams;
    const { searchableFields } = this.config;
    if (serachterm && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter: Prismastringtyes = {
                contains: serachterm as string,
                mode: "insensitive",
              };
              return { [relation]: { [nestedField]: stringFilter } };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter: Prismastringtyes = {
                contains: serachterm as string,
                mode: "insensitive",
              };
              return {
                [relation]: {
                  [nestedRelation]: { [nestedField]: stringFilter },
                },
              };
            }
            const stringfilter: Prismastringtyes = {
              contains: serachterm as string,
              mode: "insensitive" as const,
            };
            return { [field]: stringfilter };
          }
          return {
            [field]: { contains: serachterm as string, mode: "insensitive" },
          };
        },
      );

            // apply search conditions to both query and count query
            const whereConditions = this.query.where as PrismaWhereconditions;
            whereConditions.OR = searchConditions;

            const countWhereConditions = this.conuntQuery.where as PrismaWhereconditions;
            countWhereConditions.OR = searchConditions;

            return this;
        }
        return this;
    }
    // Implement other methods like filter,
    filter() : this{
        const { filterableFields } = this.config;
        const excludefields = ['page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include', 'serachterm'];
        const filterParams : Record<string, unknown> = {};
      // collect filter params (exclude pagination/sort fields)
      Object.keys(this.queryParams).forEach((key: string) => {
        if (!excludefields.includes(key)) {
          filterParams[key] = this.queryParams[key];
        }
      });

      const querywhere = this.query.where as Record<string, unknown>;
      const countwhere = this.conuntQuery.where as Record<string, unknown>;

      Object.keys(filterParams).forEach((field: string) => {
        const value = filterParams[field];
        if (value === undefined || value === "") return;

        const isallowedfield = !filterableFields || filterableFields.length === 0 || filterableFields.includes(field);
        if (!isallowedfield) return;

        // parse value (e.g., numbers, booleans, arrays)
        const parsed = this.ParseFiltervalue(value);

        if (field.includes('.')) {
          const parts = field.split('.');
          if (parts.length === 2) {
            const [relation, nestedField] = parts;
            (querywhere[relation] as Record<string, unknown>) = {
              [nestedField]: parsed,
            };
            (countwhere[relation] as Record<string, unknown>) = {
              [nestedField]: parsed,
            };
          } else if (parts.length === 3) {
            const [relation, nestedRelation, nestedField] = parts;
            (querywhere[relation] as Record<string, unknown>) = {
              [nestedRelation]: {
                [nestedField]: parsed,
              },
            };
            (countwhere[relation] as Record<string, unknown>) = {
              [nestedRelation]: {
                [nestedField]: parsed,
              },
            };
          }
        } else {
          querywhere[field] = parsed;
          countwhere[field] = parsed;
        }
        if(typeof value ==="object" && !Array.isArray(value)){
            querywhere[field] = this.ParseFiltervalue(value);
            countwhere[field] = this.ParseFiltervalue(value);

        }
      });
        return this;



    }
    private ParseFiltervalue(value : unknown): unknown{
        if(value === "true"){
            return true;
        }
        if(value === "false"){
            return false;
        }
        if(typeof value === "string" && !isNaN(Number(value)) && value.trim() !== ""){
            return Number(value);
        }
        if(Array.isArray(value)){
            return { in: value.map((item) => this.ParseFiltervalue(item)),}}
        return value;
       
    }

    private Parserangefiler(value :Record<string, unknown>):  PrismeNumberFilter | Prismastringtyes {
        const rangeQuery :Record<string, unknown> = {};
        object.keys(value).forEach((operator) => {
            const oPeratorvalue = value[operator];

            const ParseValue :string | number = typeof oPeratorvalue === "string" && !isNaN(Number(oPeratorvalue)) && oPeratorvalue.trim() !== "" ? Number(oPeratorvalue) : oPeratorvalue as string;

            switch(operator){
                case "gt":
                    rangeQuery.gt = ParseValue;
                    break;
                case "gte":
                    rangeQuery.gte = ParseValue;
                    break;
                case "lt":
                    rangeQuery.lt = ParseValue;
                    break;
                case "lte":
                    rangeQuery.lte = ParseValue;
                    break;
                case "contains":
                    rangeQuery.contains = ParseValue;
                    break;
                case "startsWith":
                    rangeQuery.startsWith = ParseValue;
                    break;
                case "endsWith":
                    rangeQuery.endsWith = ParseValue;
                    break;
                case "equals":
                    if(Array.isArray(oPeratorvalue)){
                        rangeQuery[operator] = oPeratorvalue
                    }
                    else{
                        rangeQuery[operator] = ParseValue;
                    }
            }
        })


    }
    
}
