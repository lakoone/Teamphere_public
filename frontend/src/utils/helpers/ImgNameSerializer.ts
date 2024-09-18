type imgProp = {
    img?:{
        file: File,
        id:string
    }
    imgSrc?:string
}
export function ImgNameSerializer ({img,imgSrc}:imgProp){
  if(img){
    return `${img.id}__${img.file.name.split('__').join('_')}`
  }
  else if(imgSrc){
    const result = imgSrc.split('__')
    return {
      id:result[0],
      imgName:result[2]
    }
  }
  return ''

}
