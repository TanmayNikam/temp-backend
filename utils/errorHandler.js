exports.errorHandling = (res, error, model) => {
  let message = "";
  let statusCode = "";
  if (error.name === "ValidationError") {
    statusCode = 200;
    if (
      error?.errors?.password?.kind &
      error?.errors?.password?.path &
      (error.errors.password.path === "password") &
      (error.errors.password.kind === "minlength")
    ) {
      message = "User password must be of minimum length 6";
      statusCode = 200;
    } else {
      let m;
      let r = error.message.replace(":", " --");
      r = r.replace(":", " --");
      m = r.split("--")[2];
      message = m.trim();
    }
  } else if (error.code === 11000) {
    statusCode = 200;
    message = `A ${model} already exists`;
  } else {
    statusCode = 500;
    message = "Something went wrong";
  }
  res.status(statusCode).json({
    message,
    error,
    success: false,
  });
};
