export class ApiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }

    paginate() {  // Changed name from pagination to paginate to match usage
        let {page, size} = this.queryData
        page = parseInt(page) 
        size = parseInt(size) 
        if (page <= 0) page = 1
        if (size <= 0) size = 2
        const skip = (page - 1) * size
        this.mongooseQuery.limit(size).skip(skip)
        return this
    }

    sort() {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
        }
        return this
    }

    select() {
        if (this.queryData.select) {
            this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '))
        }
        return this
    }

    filter() {
        let {page, size, sort, select, ...filter} = this.queryData
        filter = JSON.parse(JSON.stringify(filter).replace(/get|gte|lt|lte/g, match => `$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }

    // Add a getter for the query to match the usage
    get query() {
        return this.mongooseQuery
    }
}

