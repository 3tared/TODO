interface Iprops {
  msg?: string;
}

function InputErrorMessage({ msg }: Iprops) {
  return (
    msg && (
      <span className="block text-red-700 text-sm font-semibold mt-2">
        {msg}
      </span>
    )
  );
}

export default InputErrorMessage;
