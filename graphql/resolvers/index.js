const authResolver=require("./auth")
const eventResolver=require("./events")
const bookResolver=require("./booking")

const rootResolver={
    ...authResolver,
    ...eventResolver,
    ...bookResolver
}
module.exports=rootResolver