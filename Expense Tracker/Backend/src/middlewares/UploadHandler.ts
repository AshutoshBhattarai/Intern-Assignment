import multer from "multer";
import path from "path";
const storage = (id: string) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = id || "user";
      const destinationPath = path.join("./uploads", folder);
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

const UploadHandler = (id: string) =>
  multer({ storage: storage(id) }).single("image");

export default UploadHandler;
