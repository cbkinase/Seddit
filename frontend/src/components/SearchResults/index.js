import useQuery from "../../hooks/useQuery";
import { useDispatch } from "react-redux";

export default function SearchResults() {
    let queryParams = useQuery();
    let query = queryParams.get("q");

    return null
}
