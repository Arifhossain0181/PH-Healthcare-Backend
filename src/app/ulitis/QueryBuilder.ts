
import {
  IQueryConfig,
  iQueryParams,
  IQueryResult,
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
    private model: PrismaModeDelegate<T>,
    private queryParams: iQueryParams,
    private config: IQueryConfig = { searchableFields: [], filterableFields: [] }
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
                  some:{
                    [nestedRelation]: {
                      [nestedField]: stringFilter,
                    },
                  }
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
    filter(): this {
      const { filterableFields } = this.config;
      const excludeFields = [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
        "fields",
        "include",
        "serachterm",
      ];

      const params: Record<string, unknown> = {};
      Object.keys(this.queryParams).forEach((k) => {
        if (!excludeFields.includes(k)) params[k] = this.queryParams[k];
      });

      const queryWhere = this.query.where as Record<string, unknown>;
      const countWhere = this.conuntQuery.where as Record<string, unknown>;

      const applyWhere = (target: Record<string, unknown>, part: Record<string, unknown>) => {
        const merged = this.deePMarge(target, part);
        // copy back into target
        Object.keys(merged).forEach((k) => (target[k] = merged[k]));
      };

      for (const field of Object.keys(params)) {
        const raw = params[field];
        if (raw === undefined || raw === "") continue;

        // top-level allowlist check (for dotted fields we check full field name)
        const isAllowed = !filterableFields || filterableFields.length === 0 || filterableFields.includes(field);
        if (!isAllowed) continue;

        // range/object filters (e.g., { gt: '10' })
        if (typeof raw === "object" && !Array.isArray(raw)) {
          const range = this.Parserangefiler(raw as Record<string, unknown>);
          // build nested where
          const parts = field.split(".");
          let wherePart: Record<string, unknown>;
          if (parts.length === 1) wherePart = { [field]: range };
          else if (parts.length === 2) wherePart = { [parts[0]]: { [parts[1]]: range } };
          else wherePart = { [parts[0]]: { [parts[1]]: { [parts[2]]: range } } };

          applyWhere(queryWhere, wherePart);
          applyWhere(countWhere, wherePart);
          continue;
        }

        // primitive or array values
        const parsed = this.ParseFiltervalue(raw);
        const parts = field.split(".");
        let wherePart: Record<string, unknown>;
        if (parts.length === 1) {
          wherePart = { [field]: parsed };
        } else if (parts.length === 2) {
          wherePart = { [parts[0]]: { [parts[1]]: parsed } };
        } else {
          wherePart = { [parts[0]]: { [parts[1]]: { [parts[2]]: parsed } } };
        }

        applyWhere(queryWhere, wherePart);
        applyWhere(countWhere, wherePart);
      }

      return this;
    }

    // Implement pagination
    paginate() : this{
        const Page = Number(this.queryParams.page) || 1
        const Limit = Number(this.queryParams.limit) || 10;
        this.page = Page;
        this.limit = Limit;
        const Skip = (Page - 1) * Limit;

        this.query.skip = Skip;
        this.query.take = this.limit;
        return this;
    }

    sort () : this{
        const sortBy = this.queryParams.sortBy || "createdAt";
        const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
        this.query.orderBy = [{ [sortBy]: sortOrder }];
        if(sortBy.includes('.')){
            const parts = sortBy.split('.');
            if(parts.length === 2){
                const [relation, nestedField] = parts;
                this.query.orderBy = [{ [relation]: { [nestedField]: sortOrder } }];
            }   
            else if(parts.length === 3){
                const [relation, nestedRelation, nestedField] = parts;
                this.query.orderBy = [{ [relation]: { [nestedRelation]: { [nestedField]: sortOrder } } }];
            }
            else{
                this.query.orderBy = [{ [sortBy]: sortOrder }];
            }
        }
            
       



      
        return this;
    }
    fields() : this{
        const  fieldsParams = this.queryParams.fields;
        const fieldArray = fieldsParams? fieldsParams.split(",").map((field) => field.trim()) : [];
        this.selectFields = {}
        fieldArray.forEach((field) => {
            if(this.selectFields[field]){
                this.selectFields[field] = true;
            }
            
               
    })
    this.query.select = this.selectFields;
    delete this.query.include;
    return this;
    }

    include(relation: TInclude) : this{
        if(this.selectFields){
            return this;
        }
        this.query.include = {
             ...(this.query.include as Record<string, unknown> ),...(relation as Record<string, unknown>)
        }


        return this;
    }

    dynamicInclude(includeConfig : Record<string, unknown>,  defaultInclude?: string[]) : this{

        if(this.selectFields){
            return this;
        }

      const result : Record<string, unknown> = {};
      defaultInclude?.forEach((field) =>{
        if(includeConfig[field] === true){
            result[field] = true;
        }
      })
      const includeParam = this.queryParams.include as string | undefined;
      if (includeParam && typeof includeParam === 'string'){
        const includeFields = includeParam.split(",").map((f) => f.trim());

        includeFields.forEach((relation: string) =>{
            if(includeConfig[relation]){
                result[relation] = includeConfig[relation] === true ? true : includeConfig[relation];
            }
        })
       


      }
      this.query.include = {
        ...(this.query.include as Record<string, unknown>), ...result
      }
        return this 
    }

    where (conditions: TWhereInput) : this{

        this.query.where  = this.deePMarge(this.query.where as Record<string, unknown>, conditions as Record<string, unknown>);
        this.conuntQuery.where = this.deePMarge(this.conuntQuery.where as Record<string, unknown>, conditions as Record<string, unknown>);
        return this;
    }

    async exec() : Promise<IQueryResult<T>>{
        const [total, data] = await Promise.all([
          this.model.count(this.conuntQuery as Parameters<typeof this.model.count>[0]),
          this.model.findMany(this.query as Parameters<typeof this.model.findMany>[0]),
        ])
        const totalPages = Math.ceil(total / this.limit);
      return {
        data,
        meta: {
          total,
          page: this.page,
          limit: this.limit,
          totalPages,
        }
      };

    }

    async count() : Promise<number>{
        return await this.model.count(this.conuntQuery as Parameters<typeof this.model.count>[0]);
    }

    getQuery() : PrismaFindManyArgs{
        return this.query
    }


    private deePMarge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
        const result = { ...target };
        for (const key in source){
            if(source[key] && typeof source[key] === "object" && !Array.isArray(source[key])){
                if(result[key] && typeof result[key] === "object" && !Array.isArray(result[key])){
                    result[key] = this.deePMarge(result[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
                }
                else{
                    result[key] = source[key];
                }
            }
        }
        return result;
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
      Object.keys(value).forEach((operator) => {
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
                    break;
                default:
                    break;
            }
        })
        return Object.keys(rangeQuery).length > 0 ? rangeQuery as PrismeNumberFilter | Prismastringtyes : value;


    }
    
}
