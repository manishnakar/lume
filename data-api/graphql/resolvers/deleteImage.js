import Image from "../../db/models/Image"

export default async function(src, args, ctx) {
  try {
    await Image.destroy({
      where: {
        id: args.id
      }
    })

    return "Success"
  } catch (ex) {
    console.error(ex)
  }
}
